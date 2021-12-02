import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { getCourseByID } from '../services/courseServices'
import { getInstructorByID } from '../services/InstructorServices'
import './styles/CoursePage.css'

export default function CoursePage() {

  const [course, setCourse] = useState({})
  const [instructor, setInstructor] = useState({})
  const courseID = useRouteMatch('/courses/course/:courseID')?.params.courseID

  useEffect(() => {
    getCourseByID(courseID, setCourse)
  },[courseID])

  useEffect(() => {
    getInstructorByID(course.instructorID, setInstructor)
  },[course])

  return (
    <div className="course-page">
      <header>
        <div className="side">
          <small>{course.category}</small>
          <h1>{course.title}</h1>
          <h5>{course.short}</h5>
          <div className="info-container">
            <div className="instructor-container">
              <img src={instructor?.profilePic} alt="" />
              <h6>Instructor: {instructor?.name}</h6>
              <hr/>
              <span>{course.studentsEnrolled} students enrolled</span>
            </div>
          </div>
        </div>
        <div className="side">
          <img src={course.cover} className="cover-img" alt="" />
        </div>
      </header>
    </div>
  )
}
