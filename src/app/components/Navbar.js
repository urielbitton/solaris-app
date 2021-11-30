import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { StoreContext } from '../store/store'
import SearchBar from './SearchBar'
import './styles/Navbar.css'

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
      <div className="side">
        <div className="nav-create-btn">
          <i className="fal fa-plus"></i>
        </div>
        <div className="nav-notifs-btn">
          <i className="far fa-bell"></i>
          <div className="notifs-num">
            <small>12</small>
          </div>
        </div>
        <div className="nav-profile-container">
          <div>
            <h5>Jennifer Hejduk</h5>
            <Link>My Settings</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
