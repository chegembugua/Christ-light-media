import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { authService, UserData } from '../services/authService';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser, data) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        if (data) {
          setUserData(data);
        } else {
          // If no doc exists but user is logged in via Firebase Auth, create a skeleton user
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const newUserData: UserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'user', // Default role MUST NOT be admin
              createdAt: Date.now(),
              fullName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || '',
              isActive: true,
              lastLogin: Date.now()
            };
            await setDoc(userDocRef, newUserData);
            setUserData(newUserData);
          } catch (error) {
             handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          }
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userData,
    loading,
    isAdmin: userData?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
