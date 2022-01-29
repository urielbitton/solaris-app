import React, {useContext, useEffect, useState} from 'react'
import { StoreContext } from '../store/store'
import './styles/Auth.css'
import firebase from 'firebase'
import { db } from '../firebase/fire'
import appLogo from '../assets/imgs/logonly2.png'
import googleIcon from '../assets/imgs/google-icon.png'
import githubIcon from '../assets/imgs/github-icon.png'
import { AppInput } from '../components/ui/AppInputs'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import { addSubDB, setDB } from '../services/CrudDB'
import { googleAuth } from "./GoogleAuth"
import { githubAuth } from "./GithubAuth"

export default function Register() {

  const {setLogAuth, loggingAuth, setLoggingAuth, setAUser, setMyUser} = useContext(StoreContext)
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
        setMyUser(user)
      }
      else {
        setAUser(null)
        setMyUser(null)
      }
    })
  } 
  const clearErrors = () => {
    setEmailError('')
    setPassError('')
  }

  const handleSignup = () => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      firebase.auth().onAuthStateChanged(user => {
        if(user && !loggingAuth) {
          user.updateProfile({
            displayName: `${fullName?.split(' ')[0]} ${fullName?.split(' ')[1]}`,
            photoURL: 'https://i.imgur.com/D4fLSKa.png'
          })
          setDB('users', user.uid, {
            firstName,
            lastName,
            email,
            phone: '',
            address: '',
            city: '',
            region: '',
            country: '',
            postCode: '',
            companyName: '',
            aboutMe: '',
            website: '',
            photoURL: 'https://i.imgur.com/D4fLSKa.png',
            userID: user.uid,
            dateCreated: new Date(),
            isInstructor: false,
            isStudent: true,
            isProMember: false
          }).then(() => { 
            const notifID = db.collection('users').doc(user.uid).collection('notifications').doc().id
            addSubDB('users', user.uid, 'notifications', {
              dateAdded: new Date(),
              notifID,
              text: 'Welcome to Solaris! Discover more about Solaris by clicking here.',
              title: `Welcome ${user?.displayName.split(' ')[0]}`,
              type: 'welcome',
              url: '/welcome',
              read: false
            })
            .then(() => {
              addSubDB('users', user.uid, 'emails', {
                email: user.email,
                subject: 'Welcome To Solaris',
                html: `Hi ${user.displayName}!<br/><br/>We would like to welcome you to Solaris, and thank you for choosing to enhance your education on
                our platform. We are confident you will learn tons of new material, pick up useful skills and improve your career experience very quickly.
                <br/>To get started, visit our home page <a href="https://solaris-app.vercel.app">here</a> where you will find the latest courses to browse
                Optionally, you can visit our welcome page <a href="https://solaris-app.vercel.app/welcome">here</a>.<br.>Lastly, you can view your account
                settings <a href="https://solaris-app.vercel.app/my-account">here</a>.<br/><br/>We look forward to hearing your success story!<br/><br/>Best,
                <br/><br/>The Solaris Team`,
                dateSent: new Date()
              })
            })
            setAUser(user)
          })
        }
        else {
          setAUser(null)
        } 
      })
    })
    .catch(err => {
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
    
    clearErrors()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSignup()
  }

  useEffect(() => { 
    clearErrors()
    authListener()
    return() => {
      setLogAuth && setLogAuth(true)
      history.push('/')
    }
  },[]) 

  useEffect(() => {
    setLoggingAuth(false)
  },[])

  return (
    <div className="login-page register-page">
      <div className="login-info">
        <div className="container">
          <img src={appLogo} className="logo" alt="logo"/>
          <h4>Register</h4>
          <h6>Discover our wide variety of courses with a free account.</h6>
          <div className="social-logins">
            <div className="google-btn btn" onClick={() => googleAuth(setMyUser)}>
              <img src={googleIcon} className="img-icon" alt="google-icon" />
              <span>Sign in with Google</span>
            </div>
            <div className="github-btn btn" onClick={() => githubAuth(setMyUser)}>
              <img src={githubIcon} className="img-icon" alt="github icon" />
              <span>Sign in with Github</span>
            </div>
          </div>
          <small className="sep-alt"><hr/><span>Or register with email</span><hr/></small>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="double-row">
              <AppInput 
                title="First Name" 
                placeholder="Jane"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <AppInput 
                title="Last Name" 
                placeholder="Anderson"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
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
          </form>
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
