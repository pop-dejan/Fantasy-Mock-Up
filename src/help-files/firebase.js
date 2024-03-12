import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

export const firebaseConfig = {
  firebase: {
    apiKey: "AIzaSyBRIVynGu_w7feX7b_bmcvQpdIyu7O9sK0",
    authDomain: "fantasy-mock-up.firebaseapp.com",
    databaseURL:
      "https://fantasy-mock-up-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fantasy-mock-up",
    storageBucket: "fantasy-mock-up.appspot.com",
    messagingSenderId: "574958326647",
    appId: "1:574958326647:web:4138d321210496be654772",
    measurementId: "G-DTDK6FD03R",
  },
  production: true,
};

export const firebase = initializeApp(firebaseConfig.firebase);
export const auth = getAuth();
export const database = getDatabase();
