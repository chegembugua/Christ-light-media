import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '../lib/firebase';

export interface PortfolioItem {
  id?: string;
  title: string;
  description: string;
  type: "photo" | "video";
  category: string;
  mediaUrls: string[];
  thumbnailUrl?: string; // Required based on prompt
  createdAt: number;
  createdBy: string;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const portfolioService = {
  uploadFile: async (
    file: File, 
    path: string, 
    onProgress?: (progress: number) => void
  ): Promise<ServiceResponse<string>> => {
    try {
      const fileRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      return new Promise((resolve) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (onProgress) onProgress(progress);
          },
          (error) => {
            console.error("Upload error:", error);
            resolve({ success: false, error: error.message });
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ success: true, data: downloadURL });
            } catch (err: any) {
               resolve({ success: false, error: err.message });
            }
          }
        );
      });
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  createItem: async (data: Omit<PortfolioItem, 'id'>): Promise<ServiceResponse<string>> => {
    try {
      const docRef = await addDoc(collection(db, 'portfolio'), data);
      return { success: true, data: docRef.id };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.CREATE, 'portfolio');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  getAllItems: async (): Promise<ServiceResponse<PortfolioItem[]>> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'portfolio'));
      const items: PortfolioItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as PortfolioItem);
      });
      return { success: true, data: items };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.LIST, 'portfolio');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  getItemById: async (id: string): Promise<ServiceResponse<PortfolioItem>> => {
    try {
      const docRef = doc(db, 'portfolio', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } as PortfolioItem };
      }
      return { success: false, error: 'Portfolio item not found' };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.GET, `portfolio/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  updateItem: async (id: string, data: Partial<PortfolioItem>): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'portfolio', id);
      await updateDoc(docRef, data);
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.UPDATE, `portfolio/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  deleteItem: async (id: string): Promise<ServiceResponse<void>> => {
    try {
      const docRef = doc(db, 'portfolio', id);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.DELETE, `portfolio/${id}`);
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  }
};

/*
// Example Usage:

import { portfolioService } from './portfolioService';

// 1. Create Portfolio Item
// const createRes = await portfolioService.createItem({
//   title: 'Wedding Video',
//   description: 'Cinematic wedding highlight reel',
//   type: 'video',
//   category: 'Weddings',
//   mediaUrls: ['https://example.com/video.mp4'],
//   createdAt: Date.now(),
//   createdBy: 'user123'
// });
// if (createRes.success) console.log('Created ID:', createRes.data);
// else console.error(createRes.error);

// 2. Get All Items
// const allRes = await portfolioService.getAllItems();
// if (allRes.success) console.log('Items:', allRes.data);

// 3. Update Item
// await portfolioService.updateItem('DOC_ID', { title: 'Updated Title' });

// 4. Delete Item
// await portfolioService.deleteItem('DOC_ID');
*/
