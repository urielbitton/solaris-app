import React, { useState } from 'react'
import logo from '../assets/imgs/logonly2.png'
import forgotPassImg from '../assets/imgs/forgot-pass.png'
import { AppInput } from '../components/ui/AppInputs'
import { Link } from "react-router-dom"
import firebase from 'firebase'
import './styles/ForgotPassword.css'

export default function ForgotPassword() {

  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSendEmail = () => {
    if(email.length) {
      firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setSuccess(true)
        setShowFeedback(true)
        setFeedback('A password reset link was sent to your email. Follow the instructions in your email.')
      })
      .catch(error => {
        console.log(error)
        setSuccess(false)
        setShowFeedback(true)
        setFeedback('There was an error sending the password reset link. Please make sure you have the correct email.')
      })
    }
  }

  return <div className="forgot-password-page">
    <div className="content">
      <header>
        <img src={logo} alt="" />
        <h4>Solaris</h4>
      </header>
      <section>
        <img src={forgotPassImg} alt="forgot password" />
        <h3>Forgot Password</h3>
        <small className="description">Enter your email and we'll send you a link to reset your password.</small>
        <AppInput 
          placeholder="jane@solaris.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button 
          onClick={() => handleSendEmail()}
          className="shadow-hover"
        >Submit</button>
        <Link 
          to="/" 
          className="back-to-login linkable"
        >Back to login</Link>
        <span 
          style={{
            color: success ? 'var(--color)' : 'var(--danger)',
            display: showFeedback ? 'block' : 'none'
          }}
          className="feedback"
        >
          {feedback}
        </span>
      </section>
    </div>
  </div>
}
