import React from 'react'
import { useHistory } from "react-router-dom"
import './styles/DiscoverCard.css'

export default function DiscoverCard(props) {

  const { img, title, description, coursesCount, url } = props.card
  const history = useHistory()

  return (
    <div className="discover-card">
      <img src={img} alt={title} />
      <hr/>
      <div className="text-container">
        <h5>{title}</h5>
        <small>{description}</small>
        <span>{coursesCount} courses</span>
      </div>
      <div className="bottom-row">
        <div className="icon-container">
          <i className="fal fa-angle-right"></i>
        </div>
      </div>
    </div>
  )
}
