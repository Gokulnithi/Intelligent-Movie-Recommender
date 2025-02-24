// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHFslEhbGHUVdLsRLNtJ9YG7q6R1_OTH4",
  authDomain: "authenticator-a00c5.firebaseapp.com",
  projectId: "authenticator-a00c5",
  storageBucket: "authenticator-a00c5.firebasestorage.app",
  messagingSenderId: "721107638881",
  appId: "1:721107638881:web:d4ca86e93cbf08a34d2820"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
