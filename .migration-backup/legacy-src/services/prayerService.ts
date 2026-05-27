import { collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, query, orderBy, where, serverTimestamp, increment, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { notificationService } from './notificationService';
import { moderationService } from './moderationService';

import { profanityService } from './profanityService';

export interface PrayerRequest {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  title: string;
  description: string;
  category: string;
  isAnonymous: boolean;
  priority?: 'low' | 'medium' | 'high';
  prayerCount: number;
  commentCount?: number;
  prayedBy?: string[];
  lastPrayedAt?: number;
  createdAt: number;
  isAnswered: boolean;
  answeredAt?: number;
}

export type CreatePrayerRequestData = Omit<PrayerRequest, 'id' | 'createdAt' | 'prayerCount' | 'isAnswered' | 'answeredAt' | 'commentCount' | 'prayedBy' | 'lastPrayedAt'>;

const COLLECTION_NAME = 'prayerRequests';

class PrayerService {
  async getPrayerRequests(categoryFilter?: string, sortBy: 'newest' | 'prayed' | 'priority' = 'newest', priorityFilter?: string): Promise<{ success: boolean; data?: PrayerRequest[]; error?: string }> {
    try {
      // Due to the complexity of multiple filters (category & priority) and sorting (priority, prayed, newest)
      // we'll fetch ordered by createdAt, and then apply filtering & sorting in memory 
      // if complex sorting/filtering is required, to avoid needing many composite indexes.
      // But we will try optimal query if possible.
      
      let q = query(collection(db, COLLECTION_NAME));
      
      // If we only have category, we can try native query
      if (categoryFilter && categoryFilter !== 'All' && !priorityFilter && sortBy !== 'priority') {
          q = query(collection(db, COLLECTION_NAME), where('category', '==', categoryFilter), orderBy(sortBy === 'newest' ? 'createdAt' : 'prayerCount', 'desc'));
      } else if (!categoryFilter || categoryFilter === 'All') {
          if (!priorityFilter) {
              if (sortBy === 'newest') q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
              else if (sortBy === 'prayed') q = query(collection(db, COLLECTION_NAME), orderBy('prayerCount', 'desc'));
              else if (sortBy === 'priority') q = query(collection(db, COLLECTION_NAME), orderBy('priority', 'desc'));
          } else {
             q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc')); // fetch all newest, filter in JS
          }
      } else {
          q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc')); // fetch all newest, filter in JS
      }
        
      const querySnapshot = await getDocs(q);
      let items: PrayerRequest[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as PrayerRequest);
      });
      
      // Apply filters in memory if we used broad query
      if (categoryFilter && categoryFilter !== 'All' && (priorityFilter || sortBy === 'priority')) {
          items = items.filter(i => i.category === categoryFilter);
      }
      if (priorityFilter && priorityFilter !== 'All') {
          items = items.filter(i => i.priority === priorityFilter);
      }
      if (sortBy === 'prayed' && (priorityFilter || categoryFilter !== 'All')) {
          items = items.sort((a, b) => b.prayerCount - a.prayerCount);
      }
      if (sortBy === 'priority' && (priorityFilter || categoryFilter !== 'All' || !priorityFilter)) {
          const priorityValues = { 'high': 3, 'medium': 2, 'low': 1, 'undefined': 0 };
          items = items.sort((a, b) => (priorityValues[b.priority || 'undefined'] || 0) - (priorityValues[a.priority || 'undefined'] || 0));
      }

      return { success: true, data: items };
    } catch (error: any) {
      // Temporary fallback due to missing indices in Firestore. When orderBy is used with where, Firestore requires a composite index.
      try {
        const qFallback = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(qFallback);
        let items: PrayerRequest[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as PrayerRequest);
        });
        
        if (categoryFilter && categoryFilter !== 'All') {
            items = items.filter(i => i.category === categoryFilter);
        }
        if (priorityFilter && priorityFilter !== 'All') {
            items = items.filter(i => i.priority === priorityFilter);
        }
        
        if (sortBy === 'prayed') {
            items = items.sort((a, b) => b.prayerCount - a.prayerCount);
        } else if (sortBy === 'priority') {
            const priorityValues = { 'high': 3, 'medium': 2, 'low': 1, 'undefined': 0 };
            items = items.sort((a, b) => (priorityValues[b.priority || 'undefined'] || 0) - (priorityValues[a.priority || 'undefined'] || 0));
        }

        return { success: true, data: items };
      } catch (err: any) {
        let errorMessage = err.message;
        try {
           handleFirestoreError(err, OperationType.LIST, COLLECTION_NAME);
        } catch (e: any) {
           try {
             const parsed = JSON.parse(e.message);
             errorMessage = parsed.error;
           } catch {
             errorMessage = e.message;
           }
        }
        return { success: false, error: errorMessage };
      }
    }
  }

  async getPrayerRequestById(id: string): Promise<{ success: boolean; data?: PrayerRequest; error?: string }> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } as PrayerRequest };
      } else {
        return { success: false, error: "Prayer request not found" };
      }
    } catch (error: any) {
        let errorMessage = error.message;
        try {
           handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
        } catch (e: any) {
           try {
             const parsed = JSON.parse(e.message);
             errorMessage = parsed.error;
           } catch {
             errorMessage = e.message;
           }
        }
        return { success: false, error: errorMessage };
    }
  }

  async createPrayerRequest(data: CreatePrayerRequestData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      let finalTitle = data.title;
      let finalDesc = data.description;

      const titleFilter = profanityService.filterText(data.title);
      const descFilter = profanityService.filterText(data.description);

      if (titleFilter.hasProfanity || descFilter.hasProfanity) {
        if (profanityService.currentAction === 'block') {
           return { success: false, error: 'Our community maintains a Christ-centered atmosphere. Please rephrase using uplifting words.' };
        } else {
           finalTitle = titleFilter.cleanedText;
           finalDesc = descFilter.cleanedText;
        }
      }

      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        title: finalTitle,
        description: finalDesc,
        createdAt: Date.now(),
        prayerCount: 0,
        commentCount: 0,
        isAnswered: false,
        prayedBy: []
      });

      if (titleFilter.hasProfanity || descFilter.hasProfanity) {
         await moderationService.reportContent('prayerRequest', docRef.id, 'system', 'System Monitor', 'Inappropriate content', 'Auto-filtered by profanity system.');
      }

      return { success: true, id: docRef.id };
    } catch (error: any) {
        let errorMessage = error.message;
        try {
           handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
        } catch (e: any) {
           try {
             const parsed = JSON.parse(e.message);
             errorMessage = parsed.error;
           } catch {
             errorMessage = e.message;
           }
        }
        return { success: false, error: errorMessage };
    }
  }

  async prayForRequest(prayerRequestId: string, userId: string, userName: string): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(db, COLLECTION_NAME, prayerRequestId);
      await updateDoc(docRef, {
        prayerCount: increment(1),
        prayedBy: arrayUnion(userId),
        lastPrayedAt: Date.now()
      });
      
      await addDoc(collection(db, 'prayerIntercessions'), {
        prayerRequestId,
        userId,
        userName,
        prayedAt: Date.now()
      });

      // Send notification
      await this.notifyPrayerIntercession(prayerRequestId, userName);
      
      return { success: true };
    } catch (error: any) {
        let errorMessage = error.message;
        try {
           handleFirestoreError(error, OperationType.UPDATE, COLLECTION_NAME);
        } catch (e: any) {
           errorMessage = e.message;
        }
        return { success: false, error: errorMessage };
    }
  }

  async unprayForRequest(prayerRequestId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(db, COLLECTION_NAME, prayerRequestId);
      await updateDoc(docRef, {
        prayerCount: increment(-1),
        prayedBy: arrayRemove(userId)
      });
      return { success: true };
    } catch (error: any) {
        let errorMessage = error.message;
        try {
           handleFirestoreError(error, OperationType.UPDATE, COLLECTION_NAME);
        } catch (e: any) {
           errorMessage = e.message;
        }
        return { success: false, error: errorMessage };
    }
  }

  async markAsAnswered(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        isAnswered: true,
        answeredAt: Date.now()
      });
      return { success: true };
    } catch (error: any) {
        let errorMessage = error.message;
        try {
           handleFirestoreError(error, OperationType.UPDATE, COLLECTION_NAME);
        } catch (e: any) {
           try {
             const parsed = JSON.parse(e.message);
             errorMessage = parsed.error;
           } catch {
             errorMessage = e.message;
           }
        }
        return { success: false, error: errorMessage };
    }
  }

  async notifyPrayerIntercession(prayerRequestId: string, userWhoPrayedName: string): Promise<void> {
    const res = await this.getPrayerRequestById(prayerRequestId);
    if (!res.success || !res.data) return;
    
    if (res.data.userId) {
       // Fetch user preferences
       const userDocRef = doc(db, 'users', res.data.userId);
       const userDoc = await getDoc(userDocRef);
       const userData = userDoc.exists() ? userDoc.data() : null;
       
       if (userData?.preferences?.prayerNotifications !== false) {
           await notificationService.sendNotification(res.data.userId, {
              type: "prayer_intercession",
              title: "Someone is praying for you",
              message: `${userWhoPrayedName} is standing in faith with you for "${res.data.title}".`,
              contentType: "prayer",
              contentId: prayerRequestId,
              intercessorName: userWhoPrayedName,
              prayerRequestId: prayerRequestId,
              prayerRequestTitle: res.data.title
           });
       }
    }
  }

  async notifyNewCommentOnPrayer(prayerRequestId: string, commenterName: string): Promise<void> {
    const res = await this.getPrayerRequestById(prayerRequestId);
    if (!res.success || !res.data) return;

    if (res.data.userId) {
       await notificationService.sendNotification(res.data.userId, {
          type: "prayer_comment",
          title: "New word of encouragement",
          message: `${commenterName} shared an encouraging word on your prayer request "${res.data.title}".`,
          contentType: "prayer",
          contentId: prayerRequestId,
          prayerRequestId: prayerRequestId,
          prayerRequestTitle: res.data.title
       });
    }
  }

  async notifyPrayerAnswered(prayerRequestId: string): Promise<void> {
    const res = await this.getPrayerRequestById(prayerRequestId);
    if (!res.success || !res.data) return;

    await notificationService.broadcastNotification({
       type: "prayer_answered",
       title: "Praise Report!",
       message: `A prayer request titled "${res.data.title}" has been answered!`,
       contentType: "prayer",
       contentId: prayerRequestId,
       prayerRequestId: prayerRequestId,
       prayerRequestTitle: res.data.title
    });
  }

  subscribeToIntercessions(callback: (intercessions: any[]) => void, limitCount: number = 5): () => void {
    const { limit } = require('firebase/firestore');
    const q = query(
      collection(db, 'prayerIntercessions'),
      orderBy('prayedAt', 'desc'),
      limit(limitCount)
    );
    return onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      callback(items);
    }, (error) => {
        if (error.message.includes('requires an index')) {
           const fallbackQ = query(
              collection(db, 'prayerIntercessions')
           );
           onSnapshot(fallbackQ, (fallbackSnapshot) => {
              const items: any[] = [];
              fallbackSnapshot.forEach((doc) => {
                  items.push({ id: doc.id, ...doc.data() });
              });
              items.sort((a,b) => b.prayedAt - a.prayedAt);
              callback(items.slice(0, limitCount));
           });
        }
    });
  }
  subscribeToPrayerRequest(id: string, callback: (prayer: PrayerRequest) => void): () => void {
    const unsubscribe = onSnapshot(doc(db, COLLECTION_NAME, id), (docSnap) => {
       if (docSnap.exists()) {
          callback({ id: docSnap.id, ...docSnap.data() } as PrayerRequest);
       }
    });
    return unsubscribe;
  }

  subscribeToPrayerComments(prayerRequestId: string, callback: (comments: any[]) => void): () => void {
    const q = query(
        collection(db, 'comments'),
        where('contentType', '==', 'prayer'),
        where('contentId', '==', prayerRequestId),
        orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items: any[] = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
        callback(items);
    }, (error) => {
        // Fallback for missing index during development
        if (error.message.includes('requires an index')) {
           console.warn('Need index for comments stream', error.message);
           const fallbackQ = query(
              collection(db, 'comments'),
              where('contentType', '==', 'prayer'),
              where('contentId', '==', prayerRequestId)
           );
           onSnapshot(fallbackQ, (fallbackSnapshot) => {
              const items: any[] = [];
              fallbackSnapshot.forEach((doc) => {
                  items.push({ id: doc.id, ...doc.data() });
              });
              items.sort((a,b) => b.createdAt - a.createdAt);
              callback(items);
           });
        }
    });
    return unsubscribe;
  }

  async addPrayerComment(prayerRequestId: string, userId: string, userName: string, userPhoto: string, comment: string, parentId?: string): Promise<{ success: boolean; id?: string; error?: string }> {
     try {
       let finalComment = comment;
       const filterRes = profanityService.filterText(comment);
       
       if (filterRes.hasProfanity) {
         if (profanityService.currentAction === 'block') {
            return { success: false, error: 'Our community maintains a Christ-centered atmosphere. Please rephrase using uplifting words.' };
         } else {
            finalComment = filterRes.cleanedText;
         }
       }

       const docRef = await addDoc(collection(db, 'comments'), {
         contentType: 'prayer',
         contentId: prayerRequestId,
         userId,
         userName,
         userPhoto,
         comment: finalComment,
         createdAt: Date.now(),
         likes: 0,
         parentId: parentId || null
       });
       await updateDoc(doc(db, COLLECTION_NAME, prayerRequestId), { commentCount: increment(1) });
       
       if (filterRes.hasProfanity) {
          await moderationService.reportContent('comment', docRef.id, 'system', 'System Monitor', 'Inappropriate content', 'Auto-filtered by profanity system.');
       }

       return { success: true, id: docRef.id };
     } catch (e: any) {
       return { success: false, error: e.message };
     }
  }

  async editPrayerComment(commentId: string, updatedComment: string): Promise<{ success: boolean; error?: string }> {
    try {
        let finalComment = updatedComment;
        const filterRes = profanityService.filterText(updatedComment);
        
        if (filterRes.hasProfanity) {
          if (profanityService.currentAction === 'block') {
             return { success: false, error: 'Our community maintains a Christ-centered atmosphere. Please rephrase using uplifting words.' };
          } else {
             finalComment = filterRes.cleanedText;
          }
        }

        const docRef = doc(db, 'comments', commentId);
        await updateDoc(docRef, {
            comment: finalComment,
            isEdited: true
        });
        
        if (filterRes.hasProfanity) {
          await moderationService.reportContent('comment', commentId, 'system', 'System Monitor', 'Inappropriate content', 'Auto-filtered by profanity system on edit.');
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
  }

  async likePrayerComment(commentId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Basic like implementation
      const likeId = `comment_${commentId}_${userId}`;
      const userLikeRef = doc(db, 'likes', likeId);
      const userLikeDoc = await getDoc(userLikeRef);
      if (userLikeDoc.exists()) {
          // Unlike
          await deleteDoc(userLikeRef);
          await updateDoc(doc(db, 'comments', commentId), { likes: increment(-1) });
          return { success: true };
      } else {
          // Like
          const { setDoc } = await import('firebase/firestore');
          await setDoc(userLikeRef, { id: likeId, userId, commentId });
          await updateDoc(doc(db, 'comments', commentId), { likes: increment(1) });
          return { success: true };
      }
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async deletePrayerComment(commentId: string, prayerRequestId: string): Promise<{ success: boolean; error?: string }> {
    try {
       await deleteDoc(doc(db, 'comments', commentId));
       await updateDoc(doc(db, COLLECTION_NAME, prayerRequestId), { commentCount: increment(-1) });
       return { success: true };
    } catch (e: any) {
       return { success: false, error: e.message };
    }
  }
}

export const prayerService = new PrayerService();
