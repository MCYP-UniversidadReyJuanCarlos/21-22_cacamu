// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoV9fBFhcuVLEjmGa9E4_c9sNoXFh57NY",
  authDomain: "tfm-phishing-iocs-3.firebaseapp.com",
  projectId: "tfm-phishing-iocs-3",
  databaseURL: "https://tfm-phishing-iocs-3-default-rtdb.firebaseio.com",
  storageBucket: "tfm-phishing-iocs-3.appspot.com",
  messagingSenderId: "343598413138",
  appId: "1:343598413138:web:8ab3b415ad9561da0bf68b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

