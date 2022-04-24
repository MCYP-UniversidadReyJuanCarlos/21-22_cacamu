// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZlFeGtKjRDqhc6nmzlZ_VNZSTlQR3RKo",
  authDomain: "tfm-phishing-iocs.firebaseapp.com",
  databaseURL: "https://tfm-phishing-iocs-default-rtdb.firebaseio.com",
  projectId: "tfm-phishing-iocs",
  storageBucket: "tfm-phishing-iocs.appspot.com",
  messagingSenderId: "679351493087",
  appId: "1:679351493087:web:e0fd9ba1fe6a5e2cfe646a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

