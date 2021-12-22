import React from 'react'
import { useHistory, useLocation } from 'react-router'
import { truncateText } from '../../utils/utilities'
import '.././styles/LessonItems.css'

export default function VideoRow(props) {

  const {lessonType, courseID, lessonID, courseUserAccess, notOpenVideoPage, onVideoClick, videoTitleLength} = props
  const {title, duration, videoID} = props.video
  const history = useHistory()
  const location = useLocation()
  const activeVideo = location.pathname.includes(videoID)

  const goToLesson = () => {
    history.push(`/courses/course/${courseID}/lesson/${lessonID}/${videoID}`)
  }
  
  const showLockMessage = () => {
    window.alert('Lesson is locked. Please purchase this course to view this lesson.')
    goToLesson()
  }

  return (
    <div 
      className={`lesson-item-row ${activeVideo ? "active" : ""}`}
      onClick={() => !notOpenVideoPage ? courseUserAccess ? goToLesson() : showLockMessage(): onVideoClick()}>
      <div className="side">
          <i className={lessonType === 'video' ? 'fas fa-play-circle' : 'fas fa-book-open'}></i>
          <h6 title={title}>{truncateText(title,videoTitleLength)}</h6>
      </div>
      <div className="side">
        <small>{courseUserAccess ? duration : <i className="fas fa-lock lockicon"></i>}</small>
      </div>
    </div>
  )
}
