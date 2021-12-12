import React, { useContext, useEffect, useState } from 'react'
import './styles/CourseCard.css'
import Ratings from './Ratings'
import { useHistory } from 'react-router'
import { getCoursesIDEnrolledByUserID } from '../services/userServices'
import { StoreContext } from '../store/store'

export default function CourseCard(props) {

  const {user} = useContext(StoreContext)
  const {id, cover, lessonsCount, title, category, studentsEnrolled, costType} = props.course
  const [userCourses, setUserCourses] = useState([])
  const history = useHistory()
  const courseUserAccess = userCourses.findIndex(x => x.courseID === id) > -1

  const playLessonClick = (e) => {
    e.stopPropagation()
  }

  const lessonsListClick = (e) => {
    e.stopPropagation()
    history.push(`/courses/course/${id}?a=scrollToLessons`)
  }

  const homePageClick = (e) => {
    e.stopPropagation()
    history.push(`/courses/course/${id}`)
  }  

  const purchaseCourseClick = (e) => {
    e.stopPropagation()
    history.push(`/checkout/course/${id}`)
  }

  useEffect(() => {
    getCoursesIDEnrolledByUserID(user?.uid, setUserCourses)
  },[user])

  return (
    <div className="course-card" onClick={() => history.push(`/courses/course/${id}`)}>
      <div className="card-container">
        <div className="img-container">
          <img src={cover} alt="" />
        </div>
        <div className="info-container">
          <div className="header">
            <h6>{lessonsCount} Lesson{lessonsCount !== 1 ? "s" : ""}</h6>
            <small className="category-badge">#{category?.replaceAll(' ','-')}</small>
          </div>
          <h4>{title}</h4>
          <div className="toolbar">
            <div className="side">
              {
                courseUserAccess ? 
                <button className="icon-container" title="Play Lessons" onClick={(e) => playLessonClick(e)}>
                  <i className="fas fa-play"></i>
                </button> :
                <button className="icon-container" title="Purchase Course" onClick={(e) => purchaseCourseClick(e)}>
                  <i className="fas fa-shopping-bag"></i>
                </button>
              }
              <button className="icon-container" title="Course Homepage" onClick={(e) => homePageClick(e)}>
                <i className="fas fa-home"></i>
              </button>
              <button className="icon-container" title="Lessons List" onClick={(e) => lessonsListClick(e)}>
                <i className="fas fa-list"></i>
              </button>
            </div>
            <div className="side">
              <small>{studentsEnrolled} student{studentsEnrolled !== 1 ? "s" : ""}</small>
            </div>
          </div>
          <div className="meta-info-container">
            <div>
              <Ratings rating={4.6}/>
              <small>{4.6} (135)</small>
            </div>
            <div>
              {courseUserAccess && <small className='purchased-badge'><i className='fal fa-check'></i>Purchased</small>}
              <small 
                className="cost-type" 
                style={{background: costType === 'pro' ? "var(--orange)" : "var(--color)"}}
              >
                {costType}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
