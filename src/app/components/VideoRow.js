import React from 'react'
import { useHistory } from 'react-router'
import { truncateText } from '../utils/utilities'
import './styles/LessonItems.css'

export default function VideoRow(props) {

  const {lessonType, courseID, lessonID, courseUserAccess, notOpenVideoPage, onVideoClick} = props
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
      onClick={() => !notOpenVideoPage ? courseUserAccess ? goToLesson() : showLockMessage(): onVideoClick()}>
      <div className="side">
          <i className={lessonType === 'video' ? 'fas fa-play-circle' : 'fas fa-book-open'}></i>
          <h6>{truncateText(title, 70)}</h6>
      </div>
      <div className="side">
        <small>{courseUserAccess ? duration : <i className="fas fa-lock lockicon"></i>}</small>
      </div>
    </div>
  )
}
