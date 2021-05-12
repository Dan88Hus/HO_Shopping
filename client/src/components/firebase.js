import firebase from 'firebase/app'
import "firebase/auth"



// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCEYq8MlhSeoGsLPGriTx-nl3Ss6l3ZC3Y",
    authDomain: "reactshoppinghus.firebaseapp.com",
    projectId: "reactshoppinghus",
    storageBucket: "reactshoppinghus.appspot.com",
    messagingSenderId: "456075821410",
    appId: "1:456075821410:web:ef0efcca4face5706aac3b"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export const auth = firebase.auth()

  export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()