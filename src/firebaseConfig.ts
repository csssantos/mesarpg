// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBRVnSGejBPDrRZmxcDnmcLoU-grVxXpzk",
  authDomain: "mesarpg-2cba7.firebaseapp.com",
  projectId: "mesarpg-2cba7",
  storageBucket: "mesarpg-2cba7.firebasestorage.app",
  messagingSenderId: "724445556544",
  appId: "1:724445556544:web:f982351b59cddd0f5a54a5",
  measurementId: "G-Y5TNYH7WCW",
  databaseURL: "https://mesarpg-2cba7-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);