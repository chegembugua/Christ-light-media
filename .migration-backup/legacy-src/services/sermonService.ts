import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ServiceResponse } from './portfolioService';

export interface SermonItem {
  id?: string;
  title: string;
  description: string;
  speaker: string;
  speakerTitle: string;
  audioUrl: string;
  videoUrl: string;
  coverImageUrl: string;
  category: string;
  scriptureReference: string;
  duration: number;
  createdAt: number;
  createdBy: string;
  playCount: number;
  isFeatured: boolean;
  tags: string[];
}

export const sermonService = {
  createItem: async (data: Omit<SermonItem, 'id'>): Promise<ServiceResponse<string>> => {
    try {
      const docRef = await addDoc(collection(db, 'sermons'), data);
      return { success: true, data: docRef.id };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
         handleFirestoreError(error, OperationType.CREATE, 'sermons');
      } catch (e: any) {
         errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  getAllItems: async (): Promise<ServiceResponse<SermonItem[]>> => {
    try {
      const q = query(collection(db, 'sermons'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items: SermonItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as SermonItem);
      });
      return { success: true, data: items };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.LIST, 'sermons');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  getItemById: async (id: string): Promise<ServiceResponse<SermonItem>> => {
    try {
      const docRef = doc(db, 'sermons', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } as SermonItem };
      }
      return { success: false, error: 'Sermon item not found' };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.GET, `sermons/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  updateItem: async (id: string, data: Partial<SermonItem>): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'sermons', id);
      await updateDoc(docRef, data);
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.UPDATE, `sermons/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  deleteItem: async (id: string): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'sermons', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.DELETE, `sermons/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  }
};
