'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signUpWithEmail: (email: string, password: string) => Promise<UserCredential>;
  signInAsGuest: () => Promise<void>; // Dev mode
  signOut: () => Promise<void>;
  getToken: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
  };

  // Sign in with email/password
  const signInWithEmail = async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Sign up with email/password
  const signUpWithEmail = async (email: string, password: string) => {
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  // DEV MODE: Bypass Firebase Auth
  const signInAsGuest = async () => {
    // Create a fake user object for development
    const fakeUser: any = {
      uid: 'guest-123',
      email: 'guest@example.com',
      displayName: 'Guest User',
      getIdToken: async () => 'fake-dev-token',
      metadata: { creationTime: new Date().toISOString() },
      providerData: [{ providerId: 'dev-mode' }]
    };
    setUser(fakeUser);
    setLoading(false);
  };

  // Sign out
  const signOut = async () => {
    setUser(null); // Clear local fake user if needed
    await firebaseSignOut(auth);
  };

  // Get current user's ID token
  const getToken = async () => {
    if (!user) return undefined;
    return await user.getIdToken();
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    signOut,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
