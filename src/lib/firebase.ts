
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "planwise-prmae",
  appId: "1:199510036537:web:312d3238ff2d471546bde8",
  storageBucket: "planwise-prmae.firebasestorage.app",
  apiKey: "AIzaSyDYVkM0CQDGNPeNAq7_ib9hg-LSvN9GyRs",
  authDomain: "planwise-prmae.firebaseapp.com",
  measurementId: "G-Y31PNM33C6",
  messagingSenderId: "199510036537"
};


// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);

export { app, auth };
