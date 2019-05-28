import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyDF7upcqkFuvtq3vgioNResfOHNxX4xclM",
  authDomain: "nd-mabills.firebaseapp.com",
  databaseURL: "https://nd-mabills.firebaseio.com",
  projectId: "nd-mabills",
  storageBucket: "nd-mabills.appspot.com",
  messagingSenderId: "242837664790",
  appId: "1:242837664790:web:33671343b30655bf"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();

export {
  auth,
  db,
  functions
}