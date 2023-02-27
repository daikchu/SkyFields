// src/firebaseInit.js
import firebase from "firebase";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAPZmmLYmU9mu5sfAJVEeS242gkIhJ8IvI",
    authDomain: "skyfields-f9129.firebaseapp.com",
    databaseURL: "https://skyfields-f9129-default-rtdb.firebaseio.com",
    projectId: "skyfields-f9129",
    storageBucket: "skyfields-f9129.appspot.com",
    messagingSenderId: "322279528188",
    appId: "1:322279528188:web:831c95e3c078e56f93e979",
    measurementId: "G-DYQCEJZ7Q3"
};

// Initialize Firebase
export default firebase.initializeApp(firebaseConfig);