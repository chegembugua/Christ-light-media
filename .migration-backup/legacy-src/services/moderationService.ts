import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { notificationService } from './notificationService';

export interface Report {
  id: string;
  contentType: 'prayerRequest' | 'comment';
  contentId: string;
  reportedBy: string;
  reportedByName: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: number;
  reviewedBy?: string;
  reviewedAt?: number;
  actionTaken?: string;
}

export const moderationService = {
  // auto-flagging using basic word filter
  profanityFilter: (text: string) => {
    const badWords = ['spam', 'hate', 'scam', 'abuse', 'fake']; // simplified
    const lowerText = text.toLowerCase();
    return badWords.some(word => lowerText.includes(word));
  },

  reportContent: async (contentType: 'prayerRequest' | 'comment', contentId: string, reportedBy: string, reportedByName: string, reason: string, description: string) => {
    try {
      // Basic rate limiting: Check localStorage
      const lastReportKey = `last_report_${reportedBy}`;
      const lastReportTime = localStorage.getItem(lastReportKey);
      
      if (lastReportTime && Date.now() - parseInt(lastReportTime) < 60000) { 
          // 1 minute cooldown
          return { success: false, error: 'Please wait before submitting another report.' };
      }

      const docRef = await addDoc(collection(db, 'reports'), {
        contentType,
        contentId,
        reportedBy,
        reportedByName,
        reason,
        description,
        status: 'pending',
        createdAt: Date.now()
      });
      
      localStorage.setItem(lastReportKey, Date.now().toString());

      // Notify moderators (broadcast system notification)
      // In a real app we might only target users with role='admin'
      await notificationService.broadcastNotification({
         type: "system",
         title: "New Report Submitted",
         message: `A ${contentType} has been reported for ${reason}.`,
      });

      return { success: true, id: docRef.id };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  subscribeToPendingReports: (callback: (reports: Report[]) => void) => {
    const q = query(
      collection(db, 'reports'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reports: Report[] = [];
      snapshot.forEach(doc => {
        reports.push({ id: doc.id, ...doc.data() } as Report);
      });
      callback(reports);
    }, (error) => {
      // Fallback for missing index
      if (error.message.includes('requires an index')) {
         const fallbackQ = query(
            collection(db, 'reports'),
            where('status', '==', 'pending')
         );
         onSnapshot(fallbackQ, (fallbackSnapshot) => {
             const reports: Report[] = [];
             fallbackSnapshot.forEach(doc => {
               reports.push({ id: doc.id, ...doc.data() } as Report);
             });
             reports.sort((a,b) => b.createdAt - a.createdAt);
             callback(reports);
         });
      }
    });
    return unsubscribe;
  },

  reviewReport: async (reportId: string, reviewedBy: string, status: 'resolved' | 'dismissed', actionTaken: string) => {
    try {
      const docRef = doc(db, 'reports', reportId);
      await updateDoc(docRef, {
        status,
        reviewedBy,
        reviewedAt: Date.now(),
        actionTaken
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  deleteContent: async (contentType: 'prayerRequest' | 'comment', contentId: string, prayerRequestId?: string) => {
    try {
      if (contentType === 'prayerRequest') {
         await deleteDoc(doc(db, 'prayerRequests', contentId));
      } else {
         await deleteDoc(doc(db, 'comments', contentId));
         // Need to decrement comment count if provided
         if (prayerRequestId) {
           const { increment } = await import('firebase/firestore');
           await updateDoc(doc(db, 'prayerRequests', prayerRequestId), { commentCount: increment(-1) });
         }
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  },

  banUser: async (userId: string, durationInDays: number, reason: string) => {
    try {
       const userRef = doc(db, 'users', userId);
       await updateDoc(userRef, {
          isBanned: true,
          banUntil: durationInDays === 0 ? 0 : Date.now() + durationInDays * 24 * 60 * 60 * 1000,
          banReason: reason
       });
       return { success: true };
    } catch (e: any) {
       return { success: false, error: e.message };
    }
  }
};
