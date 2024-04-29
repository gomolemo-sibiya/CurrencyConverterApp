// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDt-SyNQHf6_1N2XDUawu4d2S9aqneB0wg",
  authDomain: "currencyconverterapp-f7db4.firebaseapp.com",
  projectId: "currencyconverterapp-f7db4",
  storageBucket: "currencyconverterapp-f7db4.appspot.com",
  messagingSenderId: "994627724547",
  appId: "1:994627724547:web:dd73c31cc259acd307b536"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);