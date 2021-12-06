import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import { getCourseByID, getLessonsByCourseID } from '../services/courseServices'
import { getInstructorByID } from '../services/InstructorServices'
import './styles/CoursePage.css'
import placeholderImg from '../assets/imgs/placeholder.png'
import LessonsList from '../components/LessonsList'
import CourseReviews from '../components/CourseReviews'
import WriteComment from '../components/WriteComment'
import { StoreContext } from '../store/store'

export default function CoursePage() {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)
  const [course, setCourse] = useState({})
  const [instructor, setInstructor] = useState({})
  const [lessons, setLessons] = useState([])
  const courseID = useRouteMatch('/courses/course/:courseID')?.params.courseID

  const courseInfos = [
    {name: 'Course Level', icon: 'fas fa-layer-group', value: course.difficulty},
    {name: 'Category', icon: 'fas fa-th', value: course.category},
    {name: 'Course Duration', icon: 'fas fa-clock', value: course.totalDuration},
    {name: 'Lessons', icon: 'fas fa-book-open', value: course.lessonsCount},
    {name: 'Certificate', icon: 'fas fa-certificate', value: course.hasCertificate?"Yes":"No"},
    {name: 'Language', icon: 'fas fa-language', value: course.language},
  ]

  const courseInfosRender = courseInfos?.map((info,i) => {
    return <div className="row" key={i}>
      <h5>
        <i className={info.icon}></i>
        {info.name}
      </h5>
      <span>{info.value}</span>
    </div>
  })

  const whatYouLearnRender = course.whatYouLearn?.map((el,i) => {
    return <span key={i}>
      <i className="far fa-check"></i>
      {el}
    </span>
  })

  useEffect(() => {
    getCourseByID(courseID, setCourse)
    getLessonsByCourseID(courseID, setLessons)
  },[courseID])

  useEffect(() => {
    getInstructorByID(course?.instructorID ?? "na", setInstructor)
    setNavTitle('Course')
    setNavDescript(course.title) 
  },[course])


  return (
    <div className="course-page">
      <header className="banner">
        <div className="side">
          <small>{course.category}</small>
          <h1>{course.title}</h1>
          <h5>{course.short}</h5>
          <div className="info-container">
            <div className="instructor-row">
              <span className="title">Instructor</span>
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
            <p className="course-description">{course.description}</p>
          </section>
          <section>
            <h3>What you'll learn in this course</h3>
            <div className="list-elements">
              {whatYouLearnRender} 
            </div>
          </section>
          <LessonsList 
            lessons={lessons}
            courseID={courseID}
            title="Course Content"
          />
          <section>
            <h3>Instructor</h3>
            <div className="instructor-container">
              <div>
                <img src={instructor?.profilePic} alt="" />
                <div className="instructor-info">
                  <h2>{instructor?.name}</h2>
                  <h5>{instructor?.title}</h5>
                  <div className="instructor-data">
                    <div>
                      <big>1</big>
                      <span>Courses</span>
                    </div>
                    <div className="border">
                      <big>0</big>
                      <span>Reviews</span>
                    </div>
                    <div className="border">
                      <big>4.6</big>
                      <span>Rating</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="instructor-bio">
                <p>{instructor?.bio}</p>
              </div>
            </div>
          </section>
          <section>
            <CourseReviews
              courseID={courseID}
            />
          </section>
          <section>
            <WriteComment 
              courseID={courseID}
              writeType="review"
              title="Write A Review"
              titleInput="Review Title"
              messageInput="Review Summary"
            />
          </section>
        </div>
        <div className="course-info-container">
          <div className="course-info">
            <div className="header">
              <h4>Price</h4>
              <big>{course.price === 0 ? "Free" : "$"+course.price}</big>
            </div>
            <div className="content">
              {courseInfosRender}
            </div>
            <div className="share-container">
              <h5>Share this course</h5>
              <div className="socials-container">
                <div className="social-icon facebook" style={{background:'#1877f2'}}>
                  <i className="fab fa-facebook-f"></i>
                </div>
                <div className="social-icon twitter" style={{background:'#1da1f2'}}>
                  <i className="fab fa-twitter"></i>
                </div>
                <div className="social-icon linkedin" style={{background:'#0a66c2'}}>
                  <i className="fab fa-linkedin-in"></i>
                </div>
              </div>
            </div>
            <button className="enrollbtn">
              Enroll
              <i className="fal fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
