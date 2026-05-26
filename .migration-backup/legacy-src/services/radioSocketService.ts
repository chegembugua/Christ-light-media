import { io, Socket } from 'socket.io-client';
import { radioService } from './radioService';
import { auth } from '../lib/firebase';
import { onIdTokenChanged, User } from 'firebase/auth';

export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'failed';

class RadioSocketService {
  private socket: Socket | null = null;
  private currentListenerCount: number = 0;
  private connectionState: ConnectionState = 'disconnected';
  private statusListeners: Set<(state: ConnectionState) => void> = new Set();
  private countListeners: Set<(count: number, peak?: number) => void> = new Set();
  private firestoreUnsubscribe: (() => void) | null = null;
  private currentToken: string | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private isListening: boolean = false; // Track if we are currently listening

  constructor() {
    this.setupAuthListener();
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  private setConnectionState(state: ConnectionState) {
    if (this.connectionState !== state) {
      this.connectionState = state;
      this.notifyStatusListeners();
    }
  }

  private setupAuthListener() {
    // Listen for auth state changes and initial token loading
    onIdTokenChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          this.handleNewToken(token);
        } catch (error) {
          console.error('Failed to get initial token:', error);
        }
      } else {
        // User logged out or anonymous
        this.handleNewToken(null);
      }
    });
  }

  private handleNewToken(token: string | null) {
    this.currentToken = token;
    
    // If we have an active socket, just send the fresh token without disconnecting
    if (this.socket?.connected) {
      this.socket.emit('update_token', { token: this.currentToken });
      console.log('WebSocket token updated smoothly without disconnect.');
    } else if (this.socket) {
      // If disconnected, update the auth payload so next reconnect uses it
      this.socket.auth = { token: this.currentToken };
    }

    this.scheduleTokenRefresh();
  }

  public async getValidIdToken(): Promise<string | null> {
    if (!auth.currentUser) return null;
    try {
      // Pass true to force refresh if we suspect it's stale, but getIdToken() 
      // automatically refreshes if expired or close to expiry (within 5 minutes).
      return await auth.currentUser.getIdToken();
    } catch (error) {
      console.error('Error fetching valid ID token:', error);
      return null;
    }
  }

  private scheduleTokenRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
    
    // Firebase tokens expire in 1 hour. We refresh every 45 minutes to be safe.
    // 45 minutes = 45 * 60 * 1000 = 2700000 ms
    const REFRESH_INTERVAL = 45 * 60 * 1000;
    
    if (auth.currentUser) {
      this.refreshTimer = setTimeout(async () => {
        try {
          const token = await auth.currentUser?.getIdToken(true); // force refresh
          if (token) {
            this.handleNewToken(token);
          }
        } catch (error) {
          console.error("Token refresh failed. Will retry.", error);
          // If refresh fails, try again in 1 minute
          this.refreshTimer = setTimeout(() => this.scheduleTokenRefresh(), 60000);
        }
      }, REFRESH_INTERVAL);
    }
  }

  async refreshAndReconnect() {
    try {
      if (auth.currentUser) {
        this.currentToken = await auth.currentUser.getIdToken(true);
      }
      
      if (this.socket?.connected) {
        this.socket.emit('update_token', { token: this.currentToken });
      } else {
        this.connectWithReconnection(); // Will use currentToken
      }
    } catch (error) {
      console.error('Failed to manually refresh and reconnect:', error);
      this.fallbackToFirestore();
    }
  }

  connectWithReconnection() {
    if (this.socket) return;
    
    this.setConnectionState('connecting');

    // Connect to the default namespace to receive listener count updates
    this.socket = io({
      auth: { token: this.currentToken },
      reconnection: true,
      reconnectionAttempts: 8,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      randomizationFactor: 0.5
    });

    this.socket.on('connect', () => {
      this.setConnectionState('connected');
      
      // If we were previously listening and got disconnected, rejoin automatically
      if (this.isListening) {
         this.socket?.emit('join_radio');
      }

      // Stop firestore listener if we have a successful socket connection
      if (this.firestoreUnsubscribe) {
        this.firestoreUnsubscribe();
        this.firestoreUnsubscribe = null;
      }
    });

    this.socket.on('disconnect', (reason) => {
      this.handleDisconnect(reason);
    });

    // Event when a reconnection attempt is about to start
    this.socket.on('io_attempt', () => {
       // Using socket.io private event or just rely on connect_error for retries.
       // Actually 'reconnect_attempt' is standard on the Manager.
       // we listen to it via io object. Let's do it right.
    });

    // We can listen to Manager events directly
    this.socket.io.on('reconnect_attempt', async (attempt) => {
       await this.attemptReconnection(attempt);
    });

    this.socket.io.on('reconnect_failed', () => {
       this.setConnectionState('failed');
       this.fallbackToFirestore();
    });

    this.socket.on('connect_error', async (error) => {
      console.warn('Socket connect error:', error.message);
      // If auth failed, token might be expired. Refresh and retry manually.
      if (error.message.includes('Authentication') || error.message.includes('token')) {
        await this.refreshAndReconnect();
      } else {
        this.setConnectionState('connecting');
      }
    });

    this.socket.on('listener_count_update', (data: { count: number, peak?: number }) => {
      this.currentListenerCount = data.count;
      this.notifyCountListeners(data.peak);
      this.syncListenerCount();
    });
  }

  private handleDisconnect(reason: string) {
    if (reason === 'io server disconnect') {
       // Server disconnected us explicitly (e.g. invalid token), don't automatically reconnect by socket.io default
       this.setConnectionState('disconnected');
       this.refreshAndReconnect();
    } else if (reason === 'io client disconnect') {
       // We disconnected manually
       this.setConnectionState('disconnected');
    } else {
       // Network failure, socket.io will automatically try to reconnect
       this.setConnectionState('connecting');
       this.fallbackToFirestore(); 
    }
  }

  private async attemptReconnection(attempt: number) {
     console.log(`Reconnection attempt ${attempt}...`);
     this.setConnectionState('connecting');
     // Refresh token before reconnecting if we have a user
     if (auth.currentUser) {
       try {
         // Get fresh token
         this.currentToken = await auth.currentUser.getIdToken(true);
         // Update the auth object for the next connection attempt
         if (this.socket) {
            this.socket.auth = { token: this.currentToken };
         }
       } catch (error) {
         console.error('Failed to refresh token during backoff:', error);
       }
     }
  }

  private fallbackToFirestore() {
    if (!this.firestoreUnsubscribe) {
      this.firestoreUnsubscribe = radioService.getLiveListenerCount((count) => {
        if (this.connectionState !== 'connected') {
          this.currentListenerCount = count;
          this.notifyCountListeners();
        }
      });
    }
  }

  joinRadioStream() {
    this.isListening = true;
    if (!this.socket) {
      this.connectWithReconnection();
    }
    
    if (this.socket) {
      this.socket.emit('join_radio');
    } else {
      radioService.incrementListeners(); // Fallback
    }
  }

  leaveRadioStream() {
    this.isListening = false;
    if (this.socket) {
      this.socket.emit('leave_radio');
    } else {
      radioService.decrementListeners(); // Fallback
    }
  }

  syncListenerCount() {
    // Only optionally sync firestore if needed. 
    // Usually the server does this, or one of the clients.
    // For now we don't spam firestore on every socket update.
  }

  getCurrentListenerCount() {
    return this.currentListenerCount;
  }

  getConnectionStatus() {
    return this.connectionState;
  }

  onListenerCountUpdate(callback: (count: number, peak?: number) => void) {
    this.countListeners.add(callback);
    callback(this.currentListenerCount);
    return () => {
      this.countListeners.delete(callback);
    };
  }

  onConnectionStatusChange(callback: (state: ConnectionState) => void) {
    this.statusListeners.add(callback);
    callback(this.connectionState);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  private notifyCountListeners(peak?: number) {
    this.countListeners.forEach(listener => listener(this.currentListenerCount, peak));
  }

  private notifyStatusListeners() {
    this.statusListeners.forEach(listener => listener(this.connectionState));
  }
}

export const radioSocketService = new RadioSocketService();
