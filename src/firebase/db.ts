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
  apiKey: "AIzaSyB7Q_qpCuFziaz_6VMopuqlnskb_TmtEgU",
  authDomain: "spotter-fitness-d49be.firebaseapp.com",
  databaseURL: "https://spotter-fitness-d49be-default-rtdb.firebaseio.com",
  projectId: "spotter-fitness-d49be",
  storageBucket: "spotter-fitness-d49be.appspot.com",
  messagingSenderId: "388599372628",
  appId: "1:388599372628:web:657e47d366f80b48bf46c1",
  measurementId: "G-BY1L904251"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export const chatsRef = ref(db, "chats");
export const requestsRef = ref(db, "requests");
export const activeUsersRef = ref(db, "chat-active-users");

export default {};
