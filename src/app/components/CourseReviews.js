import React, { useEffect, useState } from 'react'
import { getReviewsByCourseID } from '../services/courseServices'
import ReviewCard from './ReviewCard'
import './styles/CourseReviews.css'

export default function CourseReviews(props) {

  const {courseID} = props
  const [reviews, setReviews] = useState([])

  const reviewRender = reviews?.map((review,i) => {
    return <ReviewCard review={review} key={i} />
  })

  useEffect(() => {
    getReviewsByCourseID(courseID, setReviews)
  },[courseID])

  return (
    <div className="course-reviews">
      <div className="titles">
        <h3>Reviews</h3>
        <h5>{reviews.length} Review{reviews.length !== 1 ? "s" : ""}</h5>
      </div>
      <div className="reviews-content">
        {reviewRender}
      </div>
    </div>
  )
}
