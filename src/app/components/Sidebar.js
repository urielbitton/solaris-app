import React from 'react'
import './styles/Sidebar.css'
import logoOnly from '../assets/imgs/logonly2.png'
import { menuLinks } from '../api/apis'
import { NavLink } from 'react-router-dom'
import AppButton from './AppButton'

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
      <AppButton 
        title="Quick Post"
        url="/quick-post"  
        width="150px" 
        textColor="#fff"
        style={{marginTop: '40px'}}
        leftIcon="fal fa-sticky-note"
        leftIconStyles={{color:"#fff"}}
      />
    </div>
  )
}
