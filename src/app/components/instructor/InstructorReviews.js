import React, { useEffect, useState } from 'react'
import '../course/styles/CourseReviews.css'
import InstructorReviewCard from "./InstructorReviewCard"
import { getReviewsByInstructorID } from "../../services/InstructorServices"

export default function CourseReviews(props) {

  const { instructor, instructorID, reviewsCount, rating } = props
  const [reviews, setReviews] = useState([])

  const reviewRender = reviews?.map((review,i) => {
    return <InstructorReviewCard 
      review={review} 
      instructor={instructor}
      key={i} 
    />
  })

  useEffect(() => {
    getReviewsByInstructorID(instructorID, setReviews, 100)
  },[instructorID])

  return (
    <div className="course-reviews instructor-reviews">
      <div className="titles">
        <h3>Reviews ({reviewsCount})</h3>
        <h5>Instructor Rating: {rating?.toFixed(1)}</h5>
      </div>
      <div className="reviews-content">
        {reviewRender}
      </div>
    </div>
  )
}
