import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { selfAwarenessQuiz } from '../data/quizzes/selfAwarenessQuiz';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAoWuw_RM4WysCsZRnmZRlqK442SqlXgOM",
    authDomain: "selfawareness-3f8d2.firebaseapp.com",
    projectId: "selfawareness-3f8d2",
    storageBucket: "selfawareness-3f8d2.appspot.com",
    messagingSenderId: "1043535633502",
    appId: "1:1043535633502:web:e10e7a7b15560707d5a8cf",
    measurementId: "G-ND8Q8FP6SL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function pushQuizToFirebase() {
  try {
    // Sign in (replace with your admin email and password)
    await signInWithEmailAndPassword(auth, 'your-admin-email@example.com', 'your-admin-password');

    await setDoc(doc(db, 'quizzes', selfAwarenessQuiz.id), selfAwarenessQuiz);
    console.log('Quiz successfully pushed to Firebase!');
  } catch (error) {
    console.error('Error pushing quiz to Firebase:', error);
  }
}

pushQuizToFirebase();