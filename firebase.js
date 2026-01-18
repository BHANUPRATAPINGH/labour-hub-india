// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4b47hPA2wGYWUIhkajcnWSUb8w_gQduU",
  authDomain: "labourhiringindia.firebaseapp.com",
  databaseURL: "https://labourhiringindia-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "labourhiringindia",
  storageBucket: "labourhiringindia.firebasestorage.app",
  messagingSenderId: "1057256057838",
  appId: "1:1057256057838:web:7a3b1a9e7a820a22dd3cff",
  measurementId: "G-46XRJ8RJCM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);