import React from 'react'
import './styles/AppAccordion.css'

export default function AppAccordion(props) {

  const {maxHeight=300, children, title, open, setOpen, className, noPadding, active} = props

  return (
    <div className={`app-accordion ${active ? "active": ""} ${className} ${open && "open"}`}>
      <header onClick={() => setOpen(prev => !prev)}>
        <h5>{title}</h5>
        <i className={`far fa-angle-up ${open && "down"}`}></i>
      </header>
      <div className="content" style={{maxHeight: open ? maxHeight : "0", padding: noPadding ? "0" : open ? "20px" : "0 20px"}}>
        {children}
      </div>
    </div>
  )
}
