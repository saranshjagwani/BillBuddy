import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAe1VVjMl-i7Pf0AJjnC49iud-QOIm9mmI",
  authDomain: "billbuddy-e8ffe.firebaseapp.com",
  projectId: "billbuddy-e8ffe",
  storageBucket: "billbuddy-e8ffe.firebasestorage.app",
  messagingSenderId: "970333019472",
  appId: "1:970333019472:web:039dc9f7f6037e3857e055",
  measurementId: "G-878DYKX1L5",
};

// Initialize
const app = initializeApp(firebaseConfig);
// console.log("App is",app);
// Export DB
export const db = getFirestore(app);
// console.log("DB is",db);
