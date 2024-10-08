import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAoWuw_RM4WysCsZRnmZRlqK442SqlXgOM",
    authDomain: "selfawareness-3f8d2.firebaseapp.com",
    projectId: "selfawareness-3f8d2",
    storageBucket: "selfawareness-3f8d2.appspot.com",
    messagingSenderId: "1043535633502",
    appId: "1:1043535633502:web:e10e7a7b15560707d5a8cf",
    measurementId: "G-ND8Q8FP6SL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };