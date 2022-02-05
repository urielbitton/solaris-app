import React from 'react'
import './styles/InstructorCard.css'
import Ratings from '../ui/Ratings'
import { useHistory } from 'react-router'

export default function InstructorCard(props) {

  const { instructorID, profilePic, name, title, coursesTaught, followersCount, 
    rating, reviewsCount } = props.instructor
  const history = useHistory()

  return (
    <div className="instructor-card" onClick={() => history.push(`/instructors/instructor/${instructorID}`)}>
      <div className="instructor-container">
        <img src={profilePic} className="profile-pic" alt="" />
        <div className="instructor-info">
          <div className="header">
            <small>{coursesTaught.length} course{coursesTaught.length !== 1 ? "s" : ""} taught</small>
          </div>
          <h3>{name}</h3>
          <h4>{title}</h4>
          <div className="ratings-row">
            <Ratings rating={rating} />
            <span>{rating}</span>
            <span>({reviewsCount})</span>
          </div>
          <small className="followers-count">{followersCount} follower{followersCount !== 1 ? "s" : ""}</small>
        </div>
      </div>
    </div>
  )
}
