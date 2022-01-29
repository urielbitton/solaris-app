import firebase from 'firebase'
import { addSubDB, setDB } from '../services/CrudDB'

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
              aboutMe: '',
              website: '',
              photoURL: res.additionalUserInfo.profile.picture,
              companyName: '',
              dateCreated: new Date(),
              isInstructor: false,
              isProMember: false,
              isStudent: true
            }).then(() => {
              addSubDB('users', user.uid, 'emails', {
                email: user.email,
                subject: 'Welcome To Solaris',
                html: `Hi ${user.displayName}!<br/><br/>We would like to welcome you to Solaris, and thank you for choosing our platform to enhance your 
                education on our platform. We are confident you will learn tons of new material, pick up useful skills and improve your career experience
                very quickly. <br/>To get started, visit our home page <a href="https://solaris-app.vercel.app">here</a> where you will find the latest 
                courses to browse Optionally, you can visit our welcome page <a href="https://solaris-app.vercel.app/welcome">here</a>. <br/>Lastly, you can
                view your account settings <a href="https://solaris-app.vercel.app/my-account">here</a>. <br/><br/>We look forward to hearing your success 
                story! <br/><br/>Best,<br/><br/>The Solaris Team`,
                dateSent: new Date()
              })
              setMyUser(user)
            })
          }
        }) 
      }
      else {
        setMyUser(res.user)
      }
    })
    .catch((error) => {
      console.log(error)
      window.alert('An errror occurred with the google login. Please try again.')
    }) 
}