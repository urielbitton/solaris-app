import React, { useContext, useEffect, useState } from 'react'
import logo from '../assets/imgs/logonly2.png'
import { AppInput } from '../components/ui/AppInputs'
import { Link } from "react-router-dom"
import './styles/ForgotPassword.css'
import { StoreContext } from "../store/store"
import PageLoader from '../components/ui/PageLoader'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

export default function ResetPassword() {

  const { user } = useContext(StoreContext)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const history = useHistory()
 
  const handleReset = () => {
    if(password.length > 5) {
      setLoading(true)
      user.updatePassword(password)
      .then(() => {
        setLoading(false)
        history.push('/')
      })
      .catch(error => {
        console.log(error)
        window.alert('An error occured while changing your password. Please try again later.')
        setLoading(false)
      })
    }
  }

  const generateStrongPassword = () => {
    setPassword(Math.random().toString(36).substring(2, 20))
  }

  return <div className="forgot-password-page">
    <div className="content">
      <header>
        <img src={logo} alt="" />
        <h4>Solaris</h4>
      </header>
      <section>
        <h3>Reset Password</h3>
        <small className="description">Once you reset a password you can go back and login again with your new password.</small>
        <AppInput 
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button 
          onClick={() => handleReset()}
          className="shadow-hover"
        >Reset Password</button>
        <small 
          className="generate-pass"
          onClick={() => generateStrongPassword()}
        >
          <i className="far fa-sync-alt"></i>
          Generate strong password
        </small>
        <Link 
          to="/" 
          className="back-to-login linkable"
        >Back to login</Link>
      </section>
    </div>
    <PageLoader loading={loading} />
  </div>
}
