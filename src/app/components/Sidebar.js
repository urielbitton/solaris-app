import React, { useContext, useEffect, useState } from 'react'
import './styles/Sidebar.css'
import logoOnly from '../assets/imgs/logonly2.png'
import { menuLinks } from '../api/apis'
import becomeInstr from '../assets/imgs/become-instructor.png'
import MenuLink from './MenuLink'
import { useLocation } from 'react-router'
import { StoreContext } from '../store/store'

export default function Sidebar() {

  const {myUser, openSidebar, setOpenSidebar} = useContext(StoreContext)
  const [tabOpen, setTabOpen] = useState(false)
  const location = useLocation()

  const menuRender = menuLinks
  ?.filter(x => myUser?.isInstructor ? x : !x.requireInstructor)
  .map((link,i) => {
    return <MenuLink 
      link={link} 
      tabOpen={tabOpen}
      setTabOpen={setTabOpen}
      i={i} 
      key={i} 
    />
  })

  useEffect(() => {
    if(location.pathname.includes('/courses')) {
      setTabOpen(true)
    }
    else {
      setTabOpen(false)
    }
    setOpenSidebar(false)
  },[location])

  return (
    <div className={`sidebar ${openSidebar ? "open" : ""}`}>
      <div className="sidebar-scroll hidescroll">
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
      <div className="close-container" onClick={() => setOpenSidebar(false)}>
        <i className="fal fa-times"></i>
      </div>
    </div>
  )
}
