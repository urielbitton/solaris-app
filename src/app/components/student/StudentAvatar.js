import React from 'react'
import { useHistory } from "react-router-dom"
import './styles/StudentAvatar.css'

export default function StudentAvatar(props) {

  const { name, photoURL, subtitle, userID, clickable } = props
  const history = useHistory()

  return (
    <div 
      className="student-avatar"
      onClick={() => clickable && history.push(`/my-profile/${userID}`)}
    >
      <div className="img-container">
        <img src={photoURL} alt={name} />
      </div>
      <h5>{name}</h5>
      {
        subtitle &&
        <small>{subtitle}</small>
      }
    </div>
  )
}
