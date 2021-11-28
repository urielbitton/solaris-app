import React from 'react'
import { BrowserRouter as Link } from 'react-router-dom'
import './styles/AppButton.css'

export default function AppButton(props) {

  const {title, url, onClick, bgColor, textColor, leftIcon, rightIcon, 
    leftIconStyles, rightIconStyles, width, style, className} = props

  return (
    <Link to={url}>
      <div className={`appbutton ${className}`} style={{background: bgColor, width, ...style}}>
        <i className={leftIcon} style={leftIconStyles}></i>
        <span style={{color:textColor}}>{title}</span>
        <i className={rightIcon} style={rightIconStyles}></i>
      </div>
    </Link>
  )
}
