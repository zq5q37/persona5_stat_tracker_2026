import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

// Detect mobile devices (including iOS Safari, where popups are unreliable)
const isMobile = () => {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Handle the redirect result after returning from Google sign-in (mobile path)
    getRedirectResult(auth).catch((error) => {
      console.error('Redirect sign-in error:', error);
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    if (isMobile()) {
      await signInWithRedirect(auth, googleProvider);
    } else {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (error) {
        // Fallback to redirect if the popup gets blocked on desktop too
        if (
          error.code === 'auth/popup-blocked' ||
          error.code === 'auth/cancelled-popup-request'
        ) {
          await signInWithRedirect(auth, googleProvider);
        } else {
          console.error('Sign-in error:', error);
        }
      }
    }
  };

  const logout = () => signOut(auth);

  return { user, authLoading, login, logout };
}

export default useAuth;