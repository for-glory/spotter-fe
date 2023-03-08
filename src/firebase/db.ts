// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
// import { getAuth, signInWithCustomToken } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// TODO: We'll move below values to .env constants later
const firebaseConfig = {
  apiKey: "AIzaSyAZqWMHxUR4srsZkQhq0kkURDTgbLGl3mM",
  authDomain: "spotterfitness-pro-coders.firebaseapp.com",
  databaseURL: "https://spotterfitness-pro-coders-default-rtdb.firebaseio.com",
  projectId: "spotterfitness-pro-coders",
  storageBucket: "spotterfitness-pro-coders.appspot.com",
  messagingSenderId: "869230176984",
  appId: "1:869230176984:web:6b2cb336279dbea2ac05ad",
  measurementId: "G-569LLW4YM4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export const chatsRef = ref(db, "chats");
export const requestsRef = ref(db, "requests");
export const activeUsersRef = ref(db, "chat-active-users");

export default {};
