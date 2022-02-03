import React from 'react'
import { useHistory } from "react-router-dom"
import { convertFireDateToString } from "../../utils/utilities"
import './styles/CertificationCard.css'

export default function CertificationCard(props) {

  const { name, courseName, dateCompleted, courseID, studentID,
    certificationID } = props.certification
  const history = useHistory()

  return (
    <div 
      className="certification-card"
      onClick={() => history.push(`/certification/${courseID}/${studentID}/${certificationID}`)}
    >
      <div className="contour"/>
      <div className="icon-container">
        <i className="fal fa-diploma"></i>
      </div>
      <h4>{name}</h4>
      <span>{courseName}</span>
      <h6>{convertFireDateToString(dateCompleted)}</h6>
    </div>
  )
}
