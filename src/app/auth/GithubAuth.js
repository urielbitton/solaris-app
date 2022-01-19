import firebase from 'firebase'
import { setDB } from '../services/CrudDB'

export const githubAuth = (setMyUser) => {
  const provider = new firebase.auth.GithubAuthProvider()
  firebase
  .auth()
  .signInWithPopup(provider)
  .then((result) => {
    const credential = result.credential
    const token = credential.accessToken;
    const user = result.user;
    console.log(user)
  })
  .catch((error) => {
    console.log(error.message)
  });
}