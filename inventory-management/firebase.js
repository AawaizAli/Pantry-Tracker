// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCtXflOfIWn3jWA4UTFjDwP4WTp5hzXVI4",
    authDomain: "inventory-management-ed514.firebaseapp.com",
    projectId: "inventory-management-ed514",
    storageBucket: "inventory-management-ed514.appspot.com",
    messagingSenderId: "589057715094",
    appId: "1:589057715094:web:372cb6913897d584c68bb7",
    measurementId: "G-YQ52GTCXTC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };
