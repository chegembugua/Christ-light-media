import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { User, Mail, Calendar, Settings, Bell } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Profile() {
  const { user, userData, loading } = useAuth();
  const [prayerNotificationsEnabled, setPrayerNotificationsEnabled] = useState(
     userData?.preferences?.prayerNotifications !== false
  );

  if (loading) {
     return <div className="min-h-screen pt-32 pb-32 flex justify-center"><div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin"></div></div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  const togglePrayerNotifications = async () => {
    const newValue = !prayerNotificationsEnabled;
    setPrayerNotificationsEnabled(newValue);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
         "preferences.prayerNotifications": newValue
      });
    } catch (e) {
      console.error(e);
      // Revert if failed
      setPrayerNotificationsEnabled(!newValue);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-32 bg-primary-base">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif text-white mb-8">My Profile</h1>
        
        <div className="bg-surface/50 border border-surface-hover rounded-2xl p-8 mb-8 backdrop-blur-sm">
           <div className="flex flex-col md:flex-row items-center gap-8">
             <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-hover bg-surface flex items-center justify-center shrink-0">
               {user.photoURL ? (
                 <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User className="w-12 h-12 text-gray-400" />
               )}
             </div>
             <div className="flex-1 text-center md:text-left">
               <h2 className="text-2xl font-bold text-white mb-2">{user.displayName || 'App User'}</h2>
               <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-4">
                 <Mail className="w-4 h-4" /> {user.email}
               </div>
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                 <span className="px-3 py-1 rounded-full bg-gold/10 text-gold border border-gold/20 flex items-center gap-2">
                   <Settings className="w-4 h-4" /> {userData?.role || 'User'}
                 </span>
                 <span className="text-gray-500 flex items-center gap-2">
                   <Calendar className="w-4 h-4" /> Joined: {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                 </span>
               </div>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-surface/30 border border-surface-hover rounded-2xl p-8">
             <h3 className="text-xl font-bold text-white mb-4">Account Settings</h3>
             <p className="text-gray-400 text-sm mb-6">Manage your account preferences, password, and notifications.</p>
             <button disabled className="bg-surface-hover text-gray-300 py-3 px-6 rounded-full text-sm font-medium opacity-50 cursor-not-allowed">
               Edit Profile (Coming Soon)
             </button>
           </div>
           
           <div className="bg-surface/30 border border-surface-hover rounded-2xl p-8">
             <h3 className="text-xl font-bold text-white mb-4">Notification Preferences</h3>
             <div className="space-y-4 text-gray-400 mt-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gold" />
                      <div>
                         <p className="text-white font-medium text-sm">Prayer Intercession Alerts</p>
                         <p className="text-xs mt-0.5">Get notified when someone prays for your requests</p>
                      </div>
                   </div>
                   <button 
                     onClick={togglePrayerNotifications}
                     className={`w-12 h-6 rounded-full relative transition-colors ${prayerNotificationsEnabled ? 'bg-gold' : 'bg-surface-hover'}`}
                   >
                     <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${prayerNotificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></span>
                   </button>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
