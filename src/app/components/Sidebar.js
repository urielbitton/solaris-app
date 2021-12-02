import React from 'react'
import './styles/Sidebar.css'
import logoOnly from '../assets/imgs/logonly2.png'
import { menuLinks } from '../api/apis'
import { NavLink } from 'react-router-dom'
import becomeInstr from '../assets/imgs/become-instructor.png'

export default function Sidebar() {

  const menuRender = menuLinks?.map((link,i) => {
    return <NavLink exact={link.exact} to={link.url} activeClassName="active-menu-link" key={i}>
      <div className="menu-item">
        <i className={link.icon}></i>
        <h6>{link.name}</h6>
      </div>
    </NavLink>
  })

  return (
    <div className="sidebar">
      <div className="top">
        <div className="logo-container flexcenter">
          <img src={logoOnly} alt="" className="web-logo"/>
          <h3>s<span>o</span>laris</h3>
        </div>
        <div className="menu flexcenter flexdown">
          {menuRender}
        </div>
      </div>
      <div className="instructor-container">
        <img src={becomeInstr} alt="become an instructor"/>
        <button>Become an Instructor</button>
        <div className="square" />
      </div>
    </div>
  )
}
