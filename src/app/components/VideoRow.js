import React from 'react'
import { useHistory } from 'react-router'
import './styles/LessonItems.css'

export default function VideoRow(props) {

  const {lessonType, courseID, lessonID, courseUserAccess, noClick} = props
  const {title, duration, videoID} = props.video
  const history = useHistory()

  const goToLesson = () => {
    history.push(`/courses/course/${courseID}/lesson/${lessonID}/${videoID}`)
  }
  
  const showLockMessage = () => {
    window.alert('Lesson is locked. Please purchase this course to view this lesson.')
    goToLesson()
  }

  return (
    <div 
      className="lesson-item-row" 
      onClick={() => !noClick ? courseUserAccess ? goToLesson() : showLockMessage(): null}>
      <div className="side">
          <i className={lessonType === 'video' ? 'fas fa-play-circle' : 'fas fa-book-open'}></i>
          <h6>{title}</h6>
      </div>
      <div className="side">
        <small>{courseUserAccess ? duration : <i className="fas fa-lock lockicon"></i>}</small>
      </div>
    </div>
  )
}
