import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserData {
  uid: string;
  fullName?: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  photoURL?: string;
  createdAt: number;
  lastLogin?: number;
  isActive?: boolean;
  preferences?: {
    prayerNotifications?: boolean;
  };
}

export const authService = {
  login: async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  },

  logout: async () => {
    return firebaseSignOut(auth);
  },

  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  getUserData: async (uid: string): Promise<UserData | null> => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  },

  getUserRole: async (uid: string): Promise<string | null> => {
    const data = await authService.getUserData(uid);
    return data?.role || null;
  },

  onAuthStateChange: (callback: (user: User | null, userData: UserData | null) => void) => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await authService.getUserData(user.uid);
        callback(user, userData);
      } else {
        callback(null, null);
      }
    });
  }
};
