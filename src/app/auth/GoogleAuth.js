import firebase from 'firebase'
import { setDB } from '../services/CrudDB'

export const googleAuth = (setMyUser) => {
  const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('email')
    firebase.auth().signInWithPopup(provider)
    .then((res) => {
      if(res.additionalUserInfo.isNewUser) {
        firebase.auth().onAuthStateChanged(user => {
          if(user) {
            setDB('users', user.uid, {
              userID: user.uid,
              firstName: res.additionalUserInfo.profile?.given_name,
              lastName: res.additionalUserInfo.profile?.family_name,
              email: res.additionalUserInfo.profile.email,
              phone: "",
              postCode: '',
              city: "",
              region: "",
              country: "",
              photoURL: res.additionalUserInfo.profile.picture,
              companyName: '',
              isAdmin: false,
              dateCreated: new Date(),
              isInstructor: false,
              isProMember: false
            }).then(res => {
              setMyUser(user)
            })
          }
        }) 
      }
      else {
        console.log('info:', res.additionalUserInfo)
        setMyUser(res.user)
      }
    })
    .catch((error) => {
      console.log(error)
      window.alert('An errror occurred with the google login. Please try again.')
    }) 
}