// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeAuth, indexedDBLocalPersistence, browserPopupRedirectResolver, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_Gkmeozc0Dtj2xiAaxl9MhAgOWNVgBYA",
  authDomain: "persona5-stat-tracker.firebaseapp.com",
  projectId: "persona5-stat-tracker",
  storageBucket: "persona5-stat-tracker.firebasestorage.app",
  messagingSenderId: "976538350816",
  appId: "1:976538350816:web:4dae35f81dc480fd1c8c85",
  measurementId: "G-74PQZQ41PJ"
};

const app = initializeApp(firebaseConfig);

isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
}).catch(() => {});

export const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence,
  popupRedirectResolver: browserPopupRedirectResolver,
});
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);