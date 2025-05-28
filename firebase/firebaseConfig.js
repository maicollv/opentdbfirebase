
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmwYcM6Oc1lajzoGuelM91o4jufkIZRVA",
  authDomain: "opentdb-1aae5.firebaseapp.com",
  projectId: "opentdb-1aae5",
  storageBucket: "opentdb-1aae5.firebasestorage.app",
  messagingSenderId: "51483635801",
  appId: "1:51483635801:web:206d8c9642b1a11bd5c148"
};; 
 
 const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);
 const auth = getAuth(app);

export { app, db, auth };