import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBILdAu8Q-KPPEyr5NY-P0bRCgd2WaD5ME",
	authDomain: "marriage-framework.firebaseapp.com",
	projectId: "marriage-framework",
	storageBucket: "marriage-framework.firebasestorage.app",
	messagingSenderId: "958158585396",
	appId: "1:958158585396:web:42ab543e99e70359dc5461",
	measurementId: "G-W3T9BJM4MQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
