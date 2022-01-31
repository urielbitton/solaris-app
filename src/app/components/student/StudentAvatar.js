import React from 'react'
import { useHistory } from "react-router-dom"
import './styles/StudentAvatar.css'

export default function StudentAvatar(props) {

  const { name, photoURL, subtitle, subtitleClick, userID, clickable } = props
  const history = useHistory()

  return (
    <div 
      className={`student-avatar ${!clickable ? 'not-clickable' : ''}`}
      onClick={() => clickable && history.push(`/profile/${userID}`)}
    >
      <div className="img-container">
        <img src={photoURL} alt={name} />
      </div>
      <h5>{name}</h5>
      {
        subtitle &&
        <small onClick={(e) => {
          e.stopPropagation()
          subtitleClick(e)
        }}
        >{subtitle}</small>
      }
    </div>
  )
}
