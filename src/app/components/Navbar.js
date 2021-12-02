import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { StoreContext } from '../store/store'
import SearchBar from './SearchBar'
import './styles/Navbar.css'
import profImg from '../assets/imgs/prof-img.jpg'

export default function Navbar() {

  const {navTitle, navDescript} = useContext(StoreContext)

  return (
    <div className="navbar">
      <div className="side">
        <h1 className="nav-title">{navTitle}</h1>
        <hr/>
        <h6 className="nav-descript">{navDescript}</h6>
        <SearchBar width="300px"/>
      </div>
      <div className="side right">
        <div className="nav-icon-btn nav-messages">
          <i className="far fa-comment"></i>
          <div className="notifs-num">
            <small>2</small>
          </div>
        </div>
        <div className="nav-icon-btn nav-notifs">
          <i className="far fa-bell"></i>
          <div className="notifs-num">
            <small>12</small>
          </div>
        </div>
        <div className="nav-profile-container">
          <div className="text-info-container">
            <h5>Jennifer Hejduk</h5>
            <Link to="/settings" className="linkable">My Settings</Link>
          </div>
          <div className="img-container">
            <img src={profImg} alt=""/>
            <i className="fal fa-angle-down"></i>
          </div>
        </div>
      </div>
    </div>
  )
}
