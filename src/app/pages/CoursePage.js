import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { getCourseByID } from '../services/courseServices'

export default function CoursePage() {

  const [course, setCourse] = useState({})
  const courseID = useRouteMatch('/courses/course/:courseID')?.params.courseID

  useEffect(() => {
    getCourseByID(courseID, setCourse)
  },[courseID])

  return (
    <div className="course-page">
      {course.title}
    </div>
  )
}
