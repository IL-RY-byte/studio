
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "planwise-prmae",
  appId: "1:199510036537:web:312d3238ff2d471546bde8",
  storageBucket: "planwise-prmae.appspot.com",
  apiKey: "AIzaSyDYVkM0CQDGNPeNAq7_ib9hg-LSvN9GyRs",
  authDomain: "planwise-prmae.firebaseapp.com",
  measurementId: "G-Y31PNM33C6",
  messagingSenderId: "199510036537"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
