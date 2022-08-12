// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7_UqyA9JeApw2BUCegEGGRGyddrYthlo",
  authDomain: "exam-feedback-3b562.firebaseapp.com",
  projectId: "exam-feedback-3b562",
  storageBucket: "exam-feedback-3b562.appspot.com",
  messagingSenderId: "121499702236",
  appId: "1:121499702236:web:000a59243749079e76b519",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };
