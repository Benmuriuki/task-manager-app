import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCNUqtWc8bQlPJIZ0YJcxxOU0tQ6KNOkqw",
  authDomain: "chama-b902f.firebaseapp.com",
  projectId: "chama-b902f",
  storageBucket: "chama-b902f.appspot.com",
  messagingSenderId: "81314542055",
  appId: "1:81314542055:web:82e9ab7b40bf455b040d42"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
