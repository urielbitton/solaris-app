import React, {useContext, useEffect, useState} from 'react'
import { StoreContext } from '../store/store'
import firebase from 'firebase'
import { db } from '../firebase/fire'
import appLogo from '../assets/imgs/logonly2.png'
import googleIcon from '../assets/imgs/google-icon.png'
import { AppInput } from '../components/ui/AppInputs'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'

export default function Register() {

  const {setLogAuth, loggingAuth, setLoggingAuth, setAUser} = useContext(StoreContext)
  const [fullName, setFullName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('') 
  const [password, setPassword] = useState('') 
  const [emailError, setEmailError] = useState('') 
  const [passError, setPassError] = useState('')
  const history = useHistory()

  const authListener = () => {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        setAUser(user)
      }
      else {
        setAUser(null)
      }
    })
  } 
  const clearErrors = () => {
    setEmailError('')
    setPassError('')
  }

  const handleSignup = () => {
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(err => {
      switch(err.code) {
        case "auth/email-already-in-use":
          setEmailError('Please enter a valid email address.'); break;
        case "auth/invalid-email":
          setEmailError('Please enter a valid email address.'); break;
        case "auth/weak-password":
          setPassError('The password is not long enough or too easy to guess.')
        break
        default: 
      }
    })
    firebase.auth().onAuthStateChanged(user => {
      if(user && !loggingAuth) {
        user.updateProfile({
          displayName: `${fullName?.split(' ')[0]} ${fullName?.split(' ')[1]}`,
          photoURL: 'https://i.imgur.com/D4fLSKa.png'
        })
        db.collection('users').doc(user.uid).set({
          firstName: fullName?.split(' ')[0],
          lastName: fullName?.split(' ')[1],
          email,
          password,
          photoURL: 'https://i.imgur.com/D4fLSKa.png',
          userId: user.uid,
          dateCreated: new Date(),
          isInstructor: false
        }).then(res => { 
          setAUser(user)
        })
      }
      else {
        setAUser(null)
      } 
    })
    clearErrors()
  }

  useEffect(() => { 
    clearErrors()
    authListener()
    return() => {
      setLogAuth && setLogAuth(true)
      history.push('/')
    }
  },[]) 

  return (
    <div className="login-page register-page">
      <div className="login-info">
        <div className="container">
          <img src={appLogo} className="logo" alt="logo"/>
          <h4>Register</h4>
          <h6>Discover our wide variety of courses with a free account.</h6>
          <div className="google-btn">
            <img src={googleIcon} className="google-icon" alt="google-icon" />
            <span>Register with Google</span>
          </div>
          <small className="sep-alt"><hr/><span>Or register with email</span><hr/></small>
          <AppInput 
            title="Full Name" 
            placeholder="Jane Haste"
            onChange={(e) => setFullName(e.target.value)}
          />
          <AppInput 
            title="Email" 
            placeholder="jane@solaris.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <h6 className="email-error">{emailError}</h6>
          <AppInput 
            title="Password" 
            placeholder="5 characters or more"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          { loggingAuth ?
            <div className="login-options">
              <label>
                <input type="checkbox"/>
                <span>Remember Me</span>
              </label>
              <Link to="/forgot-password" className="linkable">Forgot password?</Link>
            </div> : 
            <div style={{height:20}}/>
          }
          <button className="submit-btn shadow-hover" onClick={handleSignup}>
            Create Account
            <i className="fal fa-arrow-right"></i>
          </button>
          <small className="no-account-text">
            Already have an account? 
            <Link to="/login" onClick={() => setLoggingAuth(true)}>Login</Link>
          </small>
        </div>
      </div>
      <div className="login-cover">
        <h1>Solaris</h1>
        <div className="sliding-text">
          <h3>Education is the key to success</h3>
          <h6>Choose from our selection of over 100+ dynamic courses.</h6>
          <div className="nav-bubbles">
            <div className="active"/><div/><div/>
          </div>
        </div>
      </div>
    </div>
  )
}
