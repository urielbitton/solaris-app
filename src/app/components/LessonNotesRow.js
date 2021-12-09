import React from 'react'
import './styles/LessonItems.css'

export default function LessonNotesRow(props) {

  const {title, text} = props.note
  const {files} = props

  return (
    <div className="lesson-item-row">
      <div className="side">
        <i className="fas fa-sticky-note"></i>
        <h6>{title.length ? title : "Files"}</h6>
        <small>{text.length > 90 ? (text.slice(0,90) + "...") : text}</small>
      </div>
      <div className="side">
        <small>{files.length} files</small>
      </div>
    </div>
  )
}
