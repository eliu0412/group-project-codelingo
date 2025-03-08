import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAtxjsRtpuIbcEg48AaZfsh-bOuC_2ydTk",
    authDomain: "codelingo-1.firebaseapp.com",
    databaseURL: "https://codelingo-1-default-rtdb.firebaseio.com",
    projectId: "codelingo-1",
    storageBucket: "codelingo-1.firebasestorage.app",
    messagingSenderId: "391880921910",
    appId: "1:391880921910:web:71fd8e36868a8b0dc05997"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);