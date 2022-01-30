import React from 'react'
import { truncateText } from '../../utils/utilities'
import './styles/LessonItems.css'

export default function LessonNotesRow(props) {

  const { title, text } = props.note
  const { onNotesClick } = props

  return (
    <div className="lesson-item-row" onClick={() => onNotesClick()}>
      <div className="side">
        <i className="fas fa-sticky-note"></i>
        <h6>{title.length ? title : ""}</h6>
      </div>
      <div className="side">
        <small>{truncateText(text, 50)}</small>
      </div>
    </div>
  )
}
