import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBe1Pnj2nRVd7taDR1sDe3vf-qfvSOA26c",
  authDomain: "dunu-dunu-nation.firebaseapp.com",
  projectId: "dunu-dunu-nation",
  storageBucket: "dunu-dunu-nation.firebasestorage.app",
  messagingSenderId: "219880316112",
  appId: "1:219880316112:web:417406962d5ded0369d2d5",
  measurementId: "G-G45QC8DE2H"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);