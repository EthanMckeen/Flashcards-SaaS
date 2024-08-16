// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1LyZ1RJcqDVm17jKqEUHZMQFs3Skxv68",
  authDomain: "flashcardsaas-f8422.firebaseapp.com",
  projectId: "flashcardsaas-f8422",
  storageBucket: "flashcardsaas-f8422.appspot.com",
  messagingSenderId: "410434944527",
  appId: "1:410434944527:web:16158827f33a749965ad7a",
  measurementId: "G-EFCXS47NG9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

if (typeof window !== "undefined") {
  const { getAnalytics } = require("firebase/analytics");
  const analytics = getAnalytics(app);
}

export {db}