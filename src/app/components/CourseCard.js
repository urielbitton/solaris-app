import React from 'react'
import './styles/CourseCard.css'
import Ratings from './Ratings'
import { useHistory } from 'react-router'

export default function CourseCard(props) {

  const {id, cover, lessonsCount, title, category, studentsEnrolled, costType} = props.course
  const history = useHistory()

  return (
    <div className="course-card" onClick={() => history.push(`/courses/course/${id}`)}>
      <div className="card-container">
        <div className="img-container">
          <img src={cover} alt="" />
        </div>
        <div className="info-container">
          <div className="header">
            <h6>{lessonsCount} Course{lessonsCount !== 1 ? "s" : ""}</h6>
            <small className="category-badge">#{category?.replaceAll(' ','-')}</small>
          </div>
          <h4>{title}</h4>
          <div className="toolbar">
            <div className="side">
              <button className="icon-container" title="Play lessons" onClick={(e) => e.stopPropagation()}>
                <i className="fas fa-play"></i>
              </button>
              <button className="icon-container" title="Course list" onClick={(e) => e.stopPropagation()}>
                <i className="fas fa-list"></i>
              </button>
              <button className="icon-container" title="Course home page" onClick={(e) => e.stopPropagation()}>
                <i className="fas fa-home"></i>
              </button>
            </div>
            <div className="side">
              <small>{studentsEnrolled} students</small>
            </div>
          </div>
          <div className="meta-info-container">
            <div>
              <Ratings rating={4.6}/>
              <small>{4.6} (135)</small>
            </div>
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
  )
}
