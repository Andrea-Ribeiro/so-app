import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/getStorage'

const firebaseConfig = {
    apiKey: "AIzaSyBZS1CkP_8JoelL0eipjFC4xGhF02NaTu8",
    authDomain: "tickets-2327f.firebaseapp.com",
    projectId: "tickets-2327f",
    storageBucket: "tickets-2327f.appspot.com",
    messagingSenderId: "920412803736",
    appId: "1:920412803736:web:4b35e5583a0a8ed9dab6ed",
    measurementId: "G-TLHK9SGKXZ"
  };

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage};