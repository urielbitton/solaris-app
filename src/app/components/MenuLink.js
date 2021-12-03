import React from 'react'
import { NavLink } from 'react-router-dom'

export default function MenuLink(props) {

  const {link, tabOpen, setTabOpen} = props

  return (
    <>
      <NavLink 
        exact={link.exact} 
        to={link.url} 
        onClick={() => link.sublinks && setTabOpen(prev => !prev)}
        activeClassName="active-menu-link" 
      >
        <div className={`menu-item ${link.sublinks && "expands"}`}>
          <div className="titles">
            <i className={link.icon}></i>
            <h6>{link.name}</h6>
          </div>
          {link.sublinks && <i className={`fal fa-angle-up ${tabOpen && "open"}`}></i>}
        </div>
      </NavLink>
      <div className={`sub-menu-container ${tabOpen && "open"}`}>
        {
          link.sublinks?.map(sublink => {
            return <NavLink 
              to={sublink.url} 
              activeClassName="active-menu-link active-sub-menu-link" 
              className="sub-menu-link"
              key={sublink.url}
            >
              <div className={`menu-item ${link.sublinks && "expands"}`}>
                <div className="titles">
                  <i className={sublink.icon}></i>
                  <h6>{sublink.name}</h6>
                </div>
                <hr />
              </div>
            </NavLink>
          })
        }
      </div>
    </>
  )
}
