
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyDwZ8nMMHHuabx51FfbyVFLJvo_isyy9q8",
  authDomain: "todolistfirebase-a198d.firebaseapp.com",
  projectId: "todolistfirebase-a198d",
  storageBucket: "todolistfirebase-a198d.appspot.com",
  messagingSenderId: "698107787003",
  appId: "1:698107787003:web:b21c87646b3f9bde0ea25e",
  measurementId: "G-WTCG45RNE9",
  databaseURL:
    "https://todolistfirebase-a198d-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db =getDatabase(app)
