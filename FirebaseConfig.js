import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBaF7sKRmwxWABJBEZDVE4AGVHq67wDRGo",
  authDomain: "projectdrawer-fac4e.firebaseapp.com",
  projectId: "projectdrawer-fac4e",
  storageBucket: "projectdrawer-fac4e.appspot.com",
  messagingSenderId: "53795767287",
  appId: "1:53795767287:web:2ac09cce3d5cf9dba2a4f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(app);
const FIREBASE_DB = getFirestore(app);

export { app, FIREBASE_AUTH, FIREBASE_DB }