
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, query, where, onSnapshot, } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword, } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyA2_bpwlxHhXOPqJLkVaNwglMhCRajpCIo",
    authDomain: "sampleyanagisawa.firebaseapp.com",
    projectId: "sampleyanagisawa",
    storageBucket: "sampleyanagisawa.appspot.com",
    messagingSenderId: "661161632425",
    appId: "1:661161632425:web:943a3771b6eabe12727fb8",
    measurementId: "G-72HSJ34PRD"
  };

// Initialize Firebase
require('firebase/auth');
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app()
}
// const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
// export const auth = app.auth()
const db = getFirestore (app);

// export default app
export {app, db, getFirestore, collection, addDoc, doc, setDoc, getDoc, query, where, onSnapshot, getAuth, signInWithEmailAndPassword, auth};