import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyANhq1KENwXBoIdrBfPteHvYH2tC6Oi-VI",
  authDomain: "gameweb-8356a.firebaseapp.com",
  projectId: "gameweb-8356a",
  storageBucket: "gameweb-8356a.appspot.com",
  messagingSenderId: "198399315884",
  appId: "1:198399315884:web:96b4b2aadba85bd6fbf409"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
