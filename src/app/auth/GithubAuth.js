import firebase from 'firebase'
import { setDB } from '../services/CrudDB'

export const githubAuth = (setMyUser) => {
  const provider = new firebase.auth.GithubAuthProvider()
  firebase
  .auth()
  .signInWithPopup(provider)
  .then((res) => {
    if(res.additionalUserInfo.isNewUser) {
      firebase.auth().onAuthStateChanged(user => {
        if(user) {
          setDB('users', user.uid, {
            userID: user.uid,
            firstName: res.additionalUserInfo.profile.username,
            lastName: '',
            email: user.email,
            phone: '',
            postCode: '',
            city: "",
            region: "",
            country: "",
            photoURL: user.photoURL,
            companyName: '',
            dateCreated: new Date(),
            isInstructor: false,
            isProMember: false,
            isStudent: true
          }).then(res => {
            setMyUser(user)
          })
        }
      })
    }
    else {
      setMyUser(res.additionalUserInfo.user)
    }
  })
  .catch((error) => {
    console.log(error.message)
  });
}