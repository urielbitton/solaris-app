import React from 'react'
import { useHistory } from 'react-router'
import './styles/VideoRow.css'

export default function VideoRow(props) {

  const {lessonType, courseID, lessonID} = props
  const {title, duration, videoID} = props.video
  const history = useHistory()

  return (
    <div className="video-row" onClick={() => history.push(`/courses/course/${courseID}/lesson/${lessonID}/${videoID}`)}>
      <div className="side">
          <i className={lessonType === 'video' ? 'fas fa-play-circle' : 'fas fa-book-open'}></i>
          <h6>{title}</h6>
      </div>
      <div className="side">
        <small>{duration}</small>
      </div>
    </div>
  )
}
