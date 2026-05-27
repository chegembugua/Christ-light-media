import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, query, where, orderBy, limit, updateDoc, writeBatch, serverTimestamp, runTransaction } from 'firebase/firestore';
import { radioSocketService } from './radioSocketService';

export interface NotificationItem {
  id?: string;
  userId: string;
  type: "new_content" | "like" | "comment" | "radio_alert" | "system" | "prayer_intercession" | "prayer_comment" | "prayer_answered";
  title: string;
  message: string;
  contentType?: string;        // "podcast", "sermon", etc.
  contentId?: string;
  prayerRequestId?: string;
  prayerRequestTitle?: string;
  intercessorName?: string;
  isRead: boolean;
  createdAt: number;
  metadata?: any;
}

class NotificationService {
  private collectionName = 'notifications';

  async broadcastNotification(notificationData: Omit<NotificationItem, 'id' | 'userId' | 'isRead' | 'createdAt'>, options?: { sendToAllUsers: boolean }) {
    try {
      let usersToNotify: string[] = [];
      const timestamp = Date.now();
      const batch = writeBatch(db);
      const newNotifications: NotificationItem[] = [];

      try {
        if (options?.sendToAllUsers !== false) {
           const usersSnapshot = await getDocs(collection(db, 'users'));
           usersToNotify = usersSnapshot.docs.map(d => d.id);
        } else {
           usersToNotify = ['admin']; // minimal fallback if not broadcasting to all
        }
      } catch (e) {
         // if fetching users fails (e.g. permission denied for normal users reporting), fallback to a system channel
         usersToNotify = ['sys_admin'];
      }

      usersToNotify.forEach(uid => {
        const docRef = doc(collection(db, this.collectionName));
        const newNotification: NotificationItem = {
          ...notificationData,
          id: docRef.id,
          userId: uid,
          isRead: false,
          createdAt: timestamp
        };
        batch.set(docRef, newNotification);
        newNotifications.push(newNotification);
      });

      await batch.commit();

      // Push real-time event via socket
      const socket = radioSocketService.getSocket();
      if (socket && socket.connected) {
        socket.emit('send_notification', { userId: 'all' });
      }
      
      return { success: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, this.collectionName);
      return { success: false, error };
    }
  }

  async sendNotification(userId: string, notificationData: Omit<NotificationItem, 'id' | 'isRead' | 'createdAt' | 'userId'>) {
    try {
      const docRef = doc(collection(db, this.collectionName));
      const newNotification: NotificationItem = {
        ...notificationData,
        id: docRef.id,
        userId,
        isRead: false,
        createdAt: Date.now()
      };

      await setDoc(docRef, newNotification);

      // Push real-time event via socket
      const socket = radioSocketService.getSocket();
      if (socket && socket.connected) {
        socket.emit('send_notification', newNotification);
      } else {
        // Since socket might not be fully initialized in some components if they only write data
        // We'll let firestore persist it anyway.
      }
      
      return { success: true, data: newNotification };
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, this.collectionName);
      return { success: false, error };
    }
  }

  async getUserNotifications(userId: string, numItems: number = 20) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', 'in', [userId, 'all']),
        orderBy('createdAt', 'desc'),
        limit(numItems)
      );
      
      const snapshot = await getDocs(q);
      const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NotificationItem));
      return { success: true, data: notifications };
    } catch (error) {
       handleFirestoreError(error, OperationType.GET, this.collectionName);
       return { success: false, error };
    }
  }

  async markAsRead(notificationId: string) {
    try {
      const docRef = doc(db, this.collectionName, notificationId);
      await updateDoc(docRef, { isRead: true });
      return { success: true };
    } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, `${this.collectionName}/${notificationId}`);
       return { success: false, error };
    }
  }

  async markAllAsRead(userId: string) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('isRead', '==', false)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return { success: true };

      const batch = writeBatch(db);
      snapshot.docs.forEach(document => {
        batch.update(document.ref, { isRead: true });
      });
      
      await batch.commit();
      return { success: true };
    } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, this.collectionName);
       return { success: false, error };
    }
  }
}

export const notificationService = new NotificationService();
