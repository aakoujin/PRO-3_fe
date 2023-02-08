
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBu0my5Otjnz6-xnG23So6nzbxjRLGwr-o",
    authDomain: "img-storage-e3b7b.firebaseapp.com",
    projectId: "img-storage-e3b7b",
    storageBucket: "img-storage-e3b7b.appspot.com",
    messagingSenderId: "853123806354",
    appId: "1:853123806354:web:6485f02cd13b3c2738224b",
    measurementId: "G-7F0V3F51LT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
