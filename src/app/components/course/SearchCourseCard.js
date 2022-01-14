import React, { useContext, useEffect, useState } from 'react'
import './styles/CourseCard.css'
import Ratings from '../ui/Ratings'
import { useHistory } from 'react-router'
import { getCoursesIDEnrolledByUserID } from '../../services/userServices'
import { StoreContext } from '../../store/store'
import { getReviewsByCourseID } from '../../services/courseServices'

export default function SearchCourseCard(props) {

  const {user, myUser} = useContext(StoreContext)
  const {id, cover, lessonsCount, title, category, studentsEnrolled, costType, instructorID,
    firstLessonID, firstVideoID} = props.hit
  const [userCourses, setUserCourses] = useState([])
  const [reviews, setReviews] = useState([])
  const history = useHistory()
  const courseUserAccess = userCourses.findIndex(x => x.courseID === id) > -1
  const isMyCourse = myUser?.instructorID === instructorID
  const averageRating = +reviews?.reduce((a,b) => a + b.rating, 0) / reviews?.length

  const handleClick = (e, path) => {
    e.stopPropagation()
    history.push(path)
  }

  useEffect(() => {
    getCoursesIDEnrolledByUserID(user?.uid, setUserCourses)
  },[user])

  useEffect(() => {
    getReviewsByCourseID(id, setReviews)
  },[id])

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
                <button className="icon-container" title="Play Lessons" onClick={(e) => handleClick(e, `/courses/course/${id}/lesson/${firstLessonID}/${firstVideoID}`)}>
                  <i className="fas fa-play"></i>
                </button> :
                <button className="icon-container" title="Purchase Course" onClick={(e) => handleClick(e, `/checkout/course/${id}`)}>
                  <i className="fas fa-shopping-bag"></i>
                </button>
              }
              <button className="icon-container" title="Course Homepage" onClick={(e) => handleClick(e, `/courses/course/${id}`)}>
                <i className="fas fa-home"></i>
              </button>
              <button className="icon-container" title="Lessons List" onClick={(e) => handleClick(e, `/courses/course/${id}?a=scrollToLessons`)}>
                <i className="fas fa-list"></i>
              </button>
              {
                isMyCourse &&
                <button className="icon-container" title="Edit Course" onClick={(e) => handleClick(e, `/edit-course/${id}`)}>
                  <i className="far fa-edit"></i>
                </button>
              }
            </div>
            <div className="side">
              <small>{studentsEnrolled} student{studentsEnrolled !== 1 ? "s" : ""}</small>
            </div>
          </div>
          <div className="meta-info-container">
            <div>
              <Ratings rating={4.6}/>
              <small>{isNaN(averageRating) ? 0 : averageRating.toFixed(1)} ({reviews.length})</small>
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
