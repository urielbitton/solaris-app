import firebase from "firebase"
 
const config = {
  apiKey: "AIzaSyDInFmYC9-FBGE6MG7496SeaE-DAsW8I_g",
  authDomain: "solaris-app-22479.firebaseapp.com",
  projectId: "solaris-app-22479",
  storageBucket: "solaris-app-22479.appspot.com",
  messagingSenderId: "457307118139",
  appId: "1:457307118139:web:77010509fdb2c5d2aada1e"
}
const firebaseApp = firebase.initializeApp(config)

const db = firebaseApp.firestore()
const Fire = firebaseApp

export { db, Fire } 
