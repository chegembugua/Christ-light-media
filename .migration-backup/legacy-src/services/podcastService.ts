import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ServiceResponse } from './portfolioService';

export interface PodcastItem {
  id?: string;
  title: string;
  description: string;
  audioUrl: string;
  coverImageUrl: string;
  speaker: string;
  category: string;
  duration: number;
  createdAt: number;
  createdBy: string;
  playCount: number;
  isFeatured: boolean;
}

export const podcastService = {
  createItem: async (data: Omit<PodcastItem, 'id'>): Promise<ServiceResponse<string>> => {
    try {
      const docRef = await addDoc(collection(db, 'podcasts'), data);
      return { success: true, data: docRef.id };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
         handleFirestoreError(error, OperationType.CREATE, 'podcasts');
      } catch (e: any) {
         errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  getAllItems: async (): Promise<ServiceResponse<PodcastItem[]>> => {
    try {
      const q = query(collection(db, 'podcasts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items: PodcastItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as PodcastItem);
      });
      return { success: true, data: items };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.LIST, 'podcasts');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  getItemById: async (id: string): Promise<ServiceResponse<PodcastItem>> => {
    try {
      const docRef = doc(db, 'podcasts', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } as PodcastItem };
      }
      return { success: false, error: 'Podcast item not found' };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.GET, `podcasts/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  updateItem: async (id: string, data: Partial<PodcastItem>): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'podcasts', id);
      await updateDoc(docRef, data);
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.UPDATE, `podcasts/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  deleteItem: async (id: string): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'podcasts', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.DELETE, `podcasts/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  }
};
