import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StoreContext } from '../store/store'
import SearchBar from './SearchBar'
import './styles/Navbar.css'
import firebase from 'firebase'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

export default function Navbar() {

  const {navTitle, navDescript, user, openSidebar, setOpenSidebar} = useContext(StoreContext)
  const [slideProfile, setSlideProfile] = useState(false)
  const history = useHistory()

  const signOut = (e) => {
    e.preventDefault()
    if(user) {
      firebase.auth().signOut()
      .then(() => {
        history.push('/')
      })
    }
  }

  useEffect(() => {
    window.onclick = () => setSlideProfile(false)
  },[slideProfile])

  return (
    <div className="navbar">
      <div className="side">
        <div className={`mobile-menu-btn ${openSidebar ? "open" : ""}`} onClick={() => setOpenSidebar(prev => !prev)}>
          <i className="fal fa-bars"></i>
        </div>
        <h1 className="nav-title">{navTitle}</h1>
        <hr/>
        <h6 className="nav-descript">{navDescript}</h6>
        <SearchBar width="300px" showIcon/>
      </div>
      <div className="side right">
        <div className="nav-icon-btn nav-notifs">
          <i className="far fa-bell"></i>
          <div className="notifs-num">
            <small>12</small>
          </div>
        </div>
        <div className="nav-profile-container">
          <div className="text-info-container">
            <h5>{user.displayName}</h5>
            <Link to="/my-account" className="linkable">My Account</Link>
          </div>
          <div className="img-container" onClick={(e) => {e.stopPropagation();setSlideProfile(prev => !prev)}}>
            <img src={user.photoURL} alt=""/>
            <i className="fal fa-angle-down"></i>
          </div>
          <div className={`profile-slide ${slideProfile ? "open" : ""}`}>
            <Link to="/my-account"><i className="far fa-user"></i>My Account</Link>
            <Link to="/settings/preferences"><i className="far fa-sliders-h"></i>Preferences</Link>
            <Link to="/get-pro"><i className="far fa-user-astronaut"></i>Get Pro</Link>
            <Link to="/support"><i className="far fa-question-circle"></i>Support</Link>
            <Link to="/" onClick={(e) => signOut(e)}><i className="far fa-sign-out"></i>Logout</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
