// =============================================
// Firebase Configuration
// =============================================
// ⚠️ این فایل را با اطلاعات پروژه Firebase خودتان جایگزین کنید
// برای گرفتن این اطلاعات:
// 1. به https://console.firebase.google.com بروید
// 2. یک پروژه جدید بسازید یا پروژه موجود را انتخاب کنید
// 3. از بخش Project Settings > General > Your apps > Web app
//    کد پیکربندی را کپی کنید
// =============================================

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

console.log("Firebase initialized successfully");
