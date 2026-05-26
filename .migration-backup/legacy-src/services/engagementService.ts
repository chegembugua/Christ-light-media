import { collection, doc, addDoc, getDocs, getDoc, setDoc, deleteDoc, query, where, orderBy, getCountFromServer, serverTimestamp, increment, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ServiceResponse } from './portfolioService';

export interface CommentItem {
  id?: string;
  contentType: string;
  contentId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  comment: string;
  createdAt: number;
  likes: number;
  parentId?: string | null;
  isEdited?: boolean;
}

export const engagementService = {
  // LIKES
  getLikesCount: async (contentType: string, contentId: string): Promise<ServiceResponse<number>> => {
    try {
      const q = query(
        collection(db, 'likes'), 
        where('contentType', '==', contentType), 
        where('contentId', '==', contentId)
      );
      const snapshot = await getCountFromServer(q);
      return { success: true, data: snapshot.data().count };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.GET, 'likes');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  checkUserLiked: async (contentType: string, contentId: string, userId: string): Promise<ServiceResponse<boolean>> => {
    try {
        if(!userId) return { success: true, data: false };
      const likeId = `${contentType}_${contentId}_${userId}`;
      const docRef = doc(db, 'likes', likeId);
      const docSnap = await getDoc(docRef);
      return { success: true, data: docSnap.exists() };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.GET, 'likes');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  likeContent: async (contentType: string, contentId: string, userId: string): Promise<ServiceResponse<void>> => {
    try {
      const likeId = `${contentType}_${contentId}_${userId}`;
      const docRef = doc(db, 'likes', likeId);
      await setDoc(docRef, {
        contentType,
        contentId,
        userId,
        createdAt: Date.now()
      });
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.CREATE, 'likes');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  unlikeContent: async (contentType: string, contentId: string, userId: string): Promise<ServiceResponse<void>> => {
    try {
      const likeId = `${contentType}_${contentId}_${userId}`;
      const docRef = doc(db, 'likes', likeId);
      await deleteDoc(docRef);
      return { success: true };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.DELETE, 'likes');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  // COMMENTS
  getComments: async (contentType: string, contentId: string): Promise<ServiceResponse<CommentItem[]>> => {
    try {
      const q = query(
        collection(db, 'comments'),
        where('contentType', '==', contentType),
        where('contentId', '==', contentId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const items: CommentItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as CommentItem);
      });
      return { success: true, data: items };
    } catch (error: any) {
      // Create index if needed
      if (error.message.includes('requires an index')) {
          console.warn('Need to create an index for comments queries:', error.message);
          // Fallback un-ordered query to avoid crashing before index exists
           try {
            const fbq = query(
                collection(db, 'comments'),
                where('contentType', '==', contentType),
                where('contentId', '==', contentId)
            );
            const fbSnapshot = await getDocs(fbq);
            const fbItems: CommentItem[] = [];
            fbSnapshot.forEach((doc) => {
                fbItems.push({ id: doc.id, ...doc.data() } as CommentItem);
            });
            // Manual sort on client side
            return { success: true, data: fbItems.sort((a,b) => b.createdAt - a.createdAt) };
           } catch(e) {}
      }

      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.LIST, 'comments');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  addComment: async (data: Omit<CommentItem, 'id'>): Promise<ServiceResponse<string>> => {
    try {
      const docRef = await addDoc(collection(db, 'comments'), data);
      return { success: true, data: docRef.id };
    } catch (error: any) {
      let errorMessage = error.message;
      try {
        handleFirestoreError(error, OperationType.CREATE, 'comments');
      } catch (e: any) {
        errorMessage = e.message;
      }
      return { success: false, error: errorMessage };
    }
  },

  editComment: async (commentId: string, updatedComment: string): Promise<ServiceResponse<void>> => {
    try {
        const docRef = doc(db, 'comments', commentId);
        await updateDoc(docRef, {
            comment: updatedComment,
            isEdited: true
        });
        return { success: true };
    } catch (error: any) {
        let errorMessage = error.message;
        try {
          handleFirestoreError(error, OperationType.UPDATE, `comments/${commentId}`);
        } catch (e: any) {
          errorMessage = e.message;
        }
        return { success: false, error: errorMessage };
    }
  },

  deleteComment: async (commentId: string): Promise<ServiceResponse<void>> => {
    try {
        const docRef = doc(db, 'comments', commentId);
        await deleteDoc(docRef);
        return { success: true };
    } catch (error: any) {
        let errorMessage = error.message;
        try {
          handleFirestoreError(error, OperationType.DELETE, `comments/${commentId}`);
        } catch (e: any) {
          errorMessage = e.message;
        }
        return { success: false, error: errorMessage };
    }
  }
};
