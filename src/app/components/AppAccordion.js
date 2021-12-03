import React from 'react'
import './styles/AppAccordion.css'

export default function AppAccordion(props) {

  const {maxHeight=300, children, title, open, setOpen, className} = props

  return (
    <div className={`app-accordion ${className} ${open && "open"}`}>
      <header onClick={() => setOpen(prev => !prev)}>
        <h5 className={open && "open"}>{title}</h5>
        <i className={`far fa-angle-up ${open && "down"}`}></i>
      </header>
      <div className="content" style={{maxHeight: open ? maxHeight : "0", padding: open ? "20px" : "0 20px"}}>
        {children}
      </div>
    </div>
  )
}
