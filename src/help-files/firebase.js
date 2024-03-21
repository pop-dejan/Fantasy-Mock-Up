import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  firebase: {
    apiKey: "******************************",
    authDomain: "******************************",
    databaseURL: "******************************",
    projectId: "******************************",
    storageBucket: "******************************",
    messagingSenderId: "******************************",
    appId: "******************************",
    measurementId: "******************************",
  },
  production: true,
};

export const firebase = initializeApp(firebaseConfig.firebase);
export const auth = getAuth();
export const storage = getStorage();
export const database = getDatabase();
