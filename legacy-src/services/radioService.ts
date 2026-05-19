import { doc, getDoc, setDoc, onSnapshot, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ServiceResponse } from './portfolioService';

export interface RadioStats {
  currentListeners: number;
  peakListeners: number;
  lastUpdated: number;
  totalListeningHours: number;
}

export const radioService = {
  getLiveListenerCount: (callback: (count: number) => void): (() => void) => {
    const docRef = doc(db, 'radioStats', 'live');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as RadioStats;
        callback(data.currentListeners || 0);
      } else {
        callback(0);
      }
    }, (error) => {
      console.error("Error fetching live listener count", error);
    });
    return unsubscribe;
  },

  incrementListeners: async (): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'radioStats', 'live');
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          currentListeners: 1,
          peakListeners: 1,
          lastUpdated: Date.now(),
          totalListeningHours: 0
        });
      } else {
        const currentData = docSnap.data() as RadioStats;
        const newListeners = (currentData.currentListeners || 0) + 1;
        const newPeak = Math.max(newListeners, currentData.peakListeners || 0);
        
        await updateDoc(docRef, {
          currentListeners: increment(1),
          peakListeners: newPeak,
          lastUpdated: Date.now()
        });
      }
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.UPDATE, 'radioStats/live');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  decrementListeners: async (): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'radioStats', 'live');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const currentData = docSnap.data() as RadioStats;
        if ((currentData.currentListeners || 0) > 0) {
          await updateDoc(docRef, {
            currentListeners: increment(-1),
            lastUpdated: Date.now()
          });
        }
      }
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.UPDATE, 'radioStats/live');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  resetListenerCount: async (): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'radioStats', 'live');
      await updateDoc(docRef, {
        currentListeners: 0,
        lastUpdated: Date.now()
      });
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.UPDATE, 'radioStats/live');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  }
};
