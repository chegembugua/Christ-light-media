import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ServiceResponse } from './portfolioService'; // Reuse the type

export interface MusicItem {
  id?: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverImageUrl: string;
  category: string;
  duration: number;
  isPaid: boolean;
  price: number;
  createdAt: number;
  uploadedBy: string;
  playCount: number;
}

export const musicService = {
  createItem: async (data: Omit<MusicItem, 'id'>): Promise<ServiceResponse<string>> => {
    try {
      const docRef = await addDoc(collection(db, 'music'), data);
      return { success: true, data: docRef.id };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.CREATE, 'music');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  getAllItems: async (): Promise<ServiceResponse<MusicItem[]>> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'music'));
      const items: MusicItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as MusicItem);
      });
      return { success: true, data: items };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.LIST, 'music');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  getItemById: async (id: string): Promise<ServiceResponse<MusicItem>> => {
    try {
      const docRef = doc(db, 'music', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } as MusicItem };
      }
      return { success: false, error: 'Music item not found' };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.GET, `music/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  updateItem: async (id: string, data: Partial<MusicItem>): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'music', id);
      await updateDoc(docRef, data);
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.UPDATE, `music/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  deleteItem: async (id: string): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'music', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.DELETE, `music/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  }
};

/*
// Example Usage:

import { musicService } from './musicService';

// 1. Create Music
// const res = await musicService.createItem({
//   title: 'Oceans (Where Feet May Fail)',
//   artist: 'Hillsong UNITED',
//   audioUrl: 'https://example.com/audio.mp3',
//   coverImageUrl: 'https://example.com/cover.jpg',
//   category: 'Worship',
//   duration: 535,
//   isPaid: false,
//   price: 0,
//   createdAt: Date.now()
// });
// 
// 2. Get All Music
// const allRes = await musicService.getAllItems();
// 
// 3. Get Music By ID
// const item = await musicService.getItemById('123');
*/
