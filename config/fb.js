import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNkT2L1R6xCp9520xrx9WByGavSpTP_Zs",
  authDomain: "riego-2d63c.firebaseapp.com",
  projectId: "riego-2d63c",
  storageBucket: "riego-2d63c.appspot.com",
  messagingSenderId: "878225490283",
  appId: "1:878225490283:web:2aa9b0f6a41f9e9b1ccc2e"
};

initializeApp(firebaseConfig);
export const database = getFirestore();