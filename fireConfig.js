// Import the functions you need from the SDKs you need

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut,
    reauthenticateWithCredential, updatePassword,EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import {
    getFirestore, collection, addDoc, setDoc, doc, query, where, getDocs, getDoc, updateDoc, deleteDoc, serverTimestamp, orderBy
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1C_MGfg_852t-V6QWyX6BDuTCQeuxd0k",
    authDomain: "hackathon-c55ff.firebaseapp.com",
    projectId: "hackathon-c55ff",
    storageBucket: "hackathon-c55ff.appspot.com",
    messagingSenderId: "780854887051",
    appId: "1:780854887051:web:0a28642fdb1c62e15c4a8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export {
    auth,
    app,
    db,
    getFirestore,
    collection,
    addDoc,
    setDoc,
    doc,
    getDoc,
    getAuth,
    createUserWithEmailAndPassword,
    query,
    where,
    getDocs,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    orderBy,
    reauthenticateWithCredential,
    updatePassword,
    EmailAuthProvider
};