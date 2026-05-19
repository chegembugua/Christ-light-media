import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ServiceResponse } from './portfolioService'; // Reuse the type

export interface DevotionItem {
  id?: string;
  title: string;
  scriptureReference: string;
  scriptureText?: string;
  content: string;
  reflectionQuestions: string[];
  prayer: string;
  category: string;
  author?: string;
  readTime?: number;
  createdAt: number;
  updatedAt?: number;
  createdBy: string;
  isFeatured: boolean;
}

export const devotionService = {
  createItem: async (data: Omit<DevotionItem, 'id'>): Promise<ServiceResponse<string>> => {
    try {
      const docRef = await addDoc(collection(db, 'devotions'), data);
      return { success: true, data: docRef.id };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.CREATE, 'devotions');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  getAllItems: async (): Promise<ServiceResponse<DevotionItem[]>> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'devotions'));
      const items: DevotionItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as DevotionItem);
      });
      return { success: true, data: items };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.LIST, 'devotions');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  getItemById: async (id: string): Promise<ServiceResponse<DevotionItem>> => {
    try {
      const docRef = doc(db, 'devotions', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } as DevotionItem };
      }
      return { success: false, error: 'Devotion not found' };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.GET, `devotions/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  updateItem: async (id: string, data: Partial<DevotionItem>): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'devotions', id);
      await updateDoc(docRef, data);
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.UPDATE, `devotions/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  deleteItem: async (id: string): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'devotions', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.DELETE, `devotions/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  }
};

/*
// Example Usage:

import { devotionService } from './devotionService';

// 1. Create Devotion
// const res = await devotionService.createItem({
//   title: 'Walking in the Light',
//   scriptureReference: '1 John 1:7',
//   scriptureText: 'But if we walk in the light, as he is in the light, we have fellowship with one another...',
//   content: 'Living in God\'s light means...',
//   reflectionQuestions: ['How can I walk in the light today?'],
//   prayer: 'Lord, help me to reflect your light.',
//   category: 'Daily Word',
//   createdAt: Date.now()
// });
// 
// 2. Get All Devotions
// const allRes = await devotionService.getAllItems();
// 
// 3. Get Devotion By ID
// const item = await devotionService.getItemById('123');
*/
