import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";

import AsyncStorage from "@react-native-async-storage/async-storage";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyA3tJX_QubS1hxR9yjBpLZYkm9WKHa8F08",
  authDomain: "recycle-29a78.firebaseapp.com",
  // databaseURL: "https://recycle-29a78-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "recycle-29a78",
  storageBucket: "recycle-29a78.appspot.com",
  messagingSenderId: "1024056946184",
  appId: "1:1024056946184:web:6f2fee9b334e7f4327abbd",
};

const app = initializeApp(firebaseConfig);

const FIREBASE_AUTH = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const FIREBASE_STORAGE = getStorage(app);

export { app, FIREBASE_AUTH, db, FIREBASE_STORAGE };