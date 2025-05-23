import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFQMfZKEz7OIdTkHN7-6_CB2_o85XUBio",
  authDomain: "lab-6-f2bc5.firebaseapp.com",
  projectId: "lab-6-f2bc5",
  storageBucket: "lab-6-f2bc5.appspot.com",
  messagingSenderId: "892497308689",
  appId: "1:892497308689:android:2edf2f21d4bc5f649715b0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
