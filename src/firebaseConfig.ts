// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRVnSGejBPDrRZmxcDnmcLoU-grVxXpzk",
  authDomain: "mesarpg-2cba7.firebaseapp.com",
  projectId: "mesarpg-2cba7",
  storageBucket: "mesarpg-2cba7.firebasestorage.app",
  messagingSenderId: "724445556544",
  appId: "1:724445556544:web:f982351b59cddd0f5a54a5",
  measurementId: "G-Y5TNYH7WCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);