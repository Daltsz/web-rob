// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCBVfLs7QPk5qQ9PJqYp6bhT38A51Hhq8g",
    authDomain: "robo-educa-cda71.firebaseapp.com",
    projectId: "robo-educa-cda71",
    storageBucket: "robo-educa-cda71.appspot.com",
    messagingSenderId: "438572382545",
    appId: "1:438572382545:web:f8ab68d09521bdd710fb70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();