import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, orderBy, limit } from "firebase/firestore";
import config from "./firebase-applet-config.fallback.json";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || config.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || config.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || config.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || config.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || config.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || config.appId,
};

let app: any = null;
let db: any = null;

try {
  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    const dbId = import.meta.env.VITE_FIREBASE_DATABASE_ID || config.firestoreDatabaseId;
    db = dbId && dbId !== "(default)" ? getFirestore(app, dbId) : getFirestore(app);
  } else {
    console.warn("Firestore Database configuration is incomplete. Database operations will not be active.");
  }
} catch (e) {
  console.error("Firebase Server Initialization Error:", e);
}

export { db, collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where, orderBy, limit };
