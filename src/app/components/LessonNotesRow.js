import React from 'react'
import { truncateText } from '../utils/utilities'
import './styles/LessonItems.css'

export default function LessonNotesRow(props) {

  const {title, text} = props.note
  const {files, onNotesClick} = props

  return (
    <div className="lesson-item-row" onClick={() => onNotesClick()}>
      <div className="side">
        <i className="fas fa-sticky-note"></i>
        <h6>{title.length ? title : "Files"}</h6>
        <small>{truncateText(text, 90)}</small>
      </div>
      <div className="side">
        <small>{files[0]?.length} file{files[0]?.length !== 1 ? "s" : ""}</small>
      </div>
    </div>
  )
}
