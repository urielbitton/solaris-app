import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import { getCourseByID } from '../services/courseServices'
import { getInstructorByID } from '../services/InstructorServices'
import './styles/CoursePage.css'
import placeholderImg from '../assets/imgs/placeholder.png'

export default function CoursePage() {

  const [course, setCourse] = useState({})
  const [instructor, setInstructor] = useState({})
  const courseID = useRouteMatch('/courses/course/:courseID')?.params.courseID

  const whatYouLearnRender = course.whatYouLearn?.map((el,i) => {
    return <span key={i}>
      <i className="far fa-check"></i>
      {el}
    </span>
  })

  useEffect(() => {
    getCourseByID(courseID, setCourse)
  },[courseID])

  useEffect(() => {
    getInstructorByID(course?.instructorID ?? ".", setInstructor)
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
              <span className="title">Instructor:</span>
              <img src={instructor?.profilePic ?? placeholderImg} alt="" />
              <h6><Link to={`/instructors/instructor/${course.instructorID}`} className="linkable">{instructor?.name}</Link></h6>
              <hr/>
              <span>{course.studentsEnrolled} students enrolled</span>
            </div>
          </div>
        </div>
        <div className="side">
          <img src={course.cover} className="cover-img" alt="" />
        </div>
      </header>
      <div className="course-content">
        <div className="text-container">
          <section>
            <h3>Course Overview</h3>
            <p>{course.description}</p>
          </section>
          <section>
            <h3>What you'll learn in this course</h3>
            <div className="list-elements">
              {whatYouLearnRender} 
            </div>
          </section>
          <section>
            <h3>Course Content</h3>
            
          </section>
        </div>
        <div className="course-info-container">
          <div className="course-info">

          </div>
        </div>
      </div>
    </div>
  )
}
