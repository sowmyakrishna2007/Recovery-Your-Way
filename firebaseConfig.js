
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyBDYYNJBMTu1ZvuFE8qxccOV7CGXlpbKxc",
  authDomain: "recovery-your-way-app.firebaseapp.com",
  databaseURL: "https://recovery-your-way-app-default-rtdb.firebaseio.com",
  projectId: "recovery-your-way-app",
  storageBucket: "recovery-your-way-app.appspot.com",
  messagingSenderId: "44552584684",
  appId: "1:44552584684:web:a55561322c0ea3dbb394c9",
  measurementId: "G-KSFZCY36L8"
};
  
  const app = initializeApp(firebaseConfig);

  // Initialize Auth with persistence
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  
  export { auth };
  
