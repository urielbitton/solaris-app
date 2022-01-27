import React, { useEffect, useState } from 'react'
import { convertFireDateToString } from '../../utils/utilities'
import Ratings from '../ui/Ratings'
import { Link } from "react-router-dom"
import { getCoursesByInstructorID } from "../../services/InstructorServices"

export default function InstructorRow(props) {

  const { instructorID, name, title, followersCount, coursesTaught, rating, 
    dateJoined, reviewsCount, profilePic } = props.instructor
  const [courses, setCourses] = useState([])

  const coursesTaughtRender = courses?.map((course, i) => {
    return '\n' + course.title
  })

  useEffect(() => {
    getCoursesByInstructorID(instructorID, setCourses, 10)
  },[])

  return (
    <div className="admin-row instructor-row">
      <h6 className="with-img">
        <img src={profilePic} alt=""/>
        <Link to={`/instructors/instructor/${instructorID}`}>{name}</Link>
      </h6>
      <h6>{title}</h6>
      <h6>{followersCount}</h6>
      <h6 title={coursesTaughtRender}>{coursesTaught.length}</h6>
      <h6>{reviewsCount}</h6>
      <Ratings 
        rating={rating} 
        ratingNumber
      />
      <h6>{convertFireDateToString(dateJoined)}</h6>
    </div>
  )
}
