import React, { useEffect, useState } from 'react'
import './styles/InstructorCard.css'
import Ratings from '../components/Ratings'
import { getReviewsByInstructorID } from '../services/InstructorServices'
import { useHistory } from 'react-router'

export default function InstructorCard(props) {

  const {instructorID, profilePic, name, title, coursesTaught, followersCount} = props.instructor
  const [reviews, setReviews] = useState([])
  const reviewsNumTotal = reviews?.reduce((a,b) => a + b?.rating, 0)
  const ratingAvg = reviewsNumTotal / reviews.length
  const history = useHistory()

  useEffect(() => {
    getReviewsByInstructorID(instructorID, setReviews, Infinity)
  },[instructorID])

  return (
    <div className="instructor-card" onClick={() => history.push(`/instructors/instructor/${instructorID}`)}>
      <div className="instructor-container">
        <img src={profilePic} className="profile-pic" alt="" />
        <div className="instructor-info">
          <div className="header">
            <small>{coursesTaught.length} course{coursesTaught.length !== 1 ? "s" : ""} taught</small>
            <small style={{color:'var(--color)'}}>{followersCount} follower{followersCount !== 1 ? "s" : ""}</small>
          </div>
          <h3>{name}</h3>
          <h4>{title}</h4>
          <div className="ratings-row">
            <Ratings rating={ratingAvg > 0 ? ratingAvg : 0} />
            <span>{isNaN(ratingAvg) ? 0 : ratingAvg}</span>
            <span>({reviews.length})</span>
          </div>
        </div>
      </div>
    </div>
  )
}
