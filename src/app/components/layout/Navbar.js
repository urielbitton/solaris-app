import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { StoreContext } from '../../store/store'
import SearchBar from '../ui/SearchBar'
import './styles/Navbar.css'
import firebase from 'firebase'
import { getUnreadNotificationsByUserID } from "../../services/userServices"
import NotificationsDropdown from "./NotificationsDropdown"
import { useLocation } from "react-router-dom"
import placeholderImg from '../../assets/imgs/placeholder.png'

export default function Navbar() {

  const {navTitle, navDescript, user, myUser, openSidebar, setOpenSidebar,
    darkMode, setDarkMode} = useContext(StoreContext)
  const [slideProfile, setSlideProfile] = useState(false)
  const [slideNotifs, setSlideNotifs] = useState(false)
  const [unreadNotifs, setUnreadNotifs] = useState(0)
  const [notifsLimit, setNotifsLimit] = useState(7)
  const location = useLocation()

  const signOut = (e) => {
    e.preventDefault()
    if(user) {
      firebase.auth().signOut()
      .then(() => {
        console.log('Logged out')
      })
    }
  }

  const openNotifs = (e) => {
    if(!location.pathname.includes('notifications')) {
      e.stopPropagation()
      setSlideNotifs(prev => !prev)
    }
  }

  useEffect(() => {
    getUnreadNotificationsByUserID(user?.uid, setUnreadNotifs)
  },[user])

  useEffect(() => {
    window.onclick = () => {
      setSlideProfile(false)
      setSlideNotifs(false)
    }
  },[slideProfile])

  return (
    <div className="navbar">
      <div className="side">
        <div 
          className={`mobile-menu-btn ${openSidebar ? "open" : ""}`} 
          onClick={(e) => {
            e.stopPropagation()
            setOpenSidebar(prev => !prev)}
          }
        >
          <i className="fal fa-bars"></i>
        </div>
        <h1 className="nav-title">{navTitle}</h1>
        { navDescript?.length ? <hr/> : ""}
        <h6 className="nav-descript">{navDescript}</h6>
        <SearchBar width="300px" showIcon/>
      </div>
      <div className="side right">
        <div 
          className="nav-icon-btn"
          onClick={() => setDarkMode(prev => !prev)}
        >
          <i className={`fa${darkMode ? "s" : "r"} fa-moon`}></i>
        </div>
        <div className="nav-icon-btn nav-notifs" onClick={(e) => openNotifs(e)}>
          <i className={`far fa-bell ${location.pathname.includes('notifications') || slideNotifs ? "active" : ""}`}></i>
          { unreadNotifs.length ?
            <div className="notifs-num">
              <small>{unreadNotifs.length}</small>
            </div> : ""
          }
        </div>
        <div className={`notifications-dropdown ${slideNotifs ? "open" : ""}`}>
          <NotificationsDropdown 
            setSlideNotifs={setSlideNotifs}
            notifsLimit={notifsLimit}
            viewAll
          />
        </div>
        <div className="nav-profile-container">
          <div className="text-info-container">
            <h5>{myUser?.firstName} {myUser?.lastName}</h5>
            <Link to="/my-account" className="linkable">My Account</Link>
          </div>
          <div className="img-container" onClick={(e) => {e.stopPropagation();setSlideProfile(prev => !prev)}}>
            <img src={myUser?.photoURL?.length ? myUser?.photoURL : placeholderImg} alt=""/>
            <i className="fal fa-angle-down"></i>
          </div>
          <div className={`profile-slide ${slideProfile ? "open" : ""}`}>
            <Link to="/my-account"><i className="far fa-user"></i>My Account</Link>
            <Link to="my-account/preferences-settings"><i className="far fa-sliders-h"></i>Preferences</Link>
            <Link to="/get-pro"><i className="far fa-user-astronaut"></i>Get Pro</Link>
            <Link to="/welcome"><i className="far fa-door-open"></i>Welcome</Link>
            <Link to="/support"><i className="far fa-question-circle"></i>Support</Link>
            <Link to="/" onClick={(e) => signOut(e)}><i className="far fa-sign-out"></i>Logout</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
