const firebaseConfig = {
    apiKey: "AIzaSyCJ5HZ-fBCXlOsJ6R_N9lJpOAn3auyress",
    authDomain: "karate-project-140c0.firebaseapp.com",
    projectId: "karate-project-140c0",
    storageBucket: "karate-project-140c0.firebasestorage.app",
    messagingSenderId: "378984137973",
    appId: "1:378984137973:web:d1010e3f5928d17cb8b1bc"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

console.log("Firebase initialized successfully");
