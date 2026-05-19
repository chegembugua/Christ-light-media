import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, orderBy, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ServiceResponse } from './portfolioService';

export interface NewsItem {
  id?: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  category: string;
  author: string;
  readTime: number;
  createdAt: number;
  createdBy: string;
  isFeatured: boolean;
  tags: string[];
  views: number;
}

export const newsService = {
  createItem: async (data: Omit<NewsItem, 'id'>): Promise<ServiceResponse<string>> => {
    try {
      const docRef = await addDoc(collection(db, 'news'), data);
      return { success: true, data: docRef.id };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
         handleFirestoreError(error, OperationType.CREATE, 'news');
      } catch (e: any) {
         errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  getAllItems: async (): Promise<ServiceResponse<NewsItem[]>> => {
    try {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items: NewsItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as NewsItem);
      });
      return { success: true, data: items };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.LIST, 'news');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  getFeaturedNews: async (): Promise<ServiceResponse<NewsItem[]>> => {
    try {
      const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items: NewsItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as NewsItem;
        if (data.isFeatured) {
          items.push({ id: doc.id, ...data });
        }
      });
      return { success: true, data: items };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.LIST, 'news');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  getItemById: async (id: string): Promise<ServiceResponse<NewsItem>> => {
    try {
      const docRef = doc(db, 'news', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } as NewsItem };
      }
      return { success: false, error: 'News item not found' };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.GET, `news/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  updateItem: async (id: string, data: Partial<NewsItem>): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'news', id);
      await updateDoc(docRef, data);
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.UPDATE, `news/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  incrementViews: async (id: string): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'news', id);
      await updateDoc(docRef, { views: increment(1) });
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.UPDATE, `news/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  deleteItem: async (id: string): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'news', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.DELETE, `news/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  }
};
