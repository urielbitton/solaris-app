import React, { useEffect, useState } from 'react'
import { getReviewsByCourseID } from '../../services/courseServices'
import './styles/CourseReviews.css'
import ReviewCard from "./ReviewCard"

export default function CourseReviews(props) {

  const { course, courseID, numberOfReviews, rating } = props
  const [reviews, setReviews] = useState([])

  const reviewRender = reviews?.map((review,i) => {
    return <ReviewCard 
      review={review} 
      course={course}
      key={i} 
    />
  })

  useEffect(() => {
    getReviewsByCourseID(courseID, setReviews, 20)
  },[courseID])

  return (
    <div className="course-reviews">
      <div className="titles">
        <h3>Reviews ({numberOfReviews})</h3>
        <h5>Course Rating: {rating?.toFixed(1)}</h5>
      </div>
      <div className="reviews-content">
        {reviewRender}
      </div>
    </div>
  )
}
