import React from 'react'
import { Link } from "react-router-dom"
import { convertFireDateToString } from '../../utils/utilities'

export default function ApplicationRow(props) {

  const { number, applicationID, name, email, preferredCategory, 
    yearsOfExperience, dateCreated } = props.application

  return (
    <div className="admin-row application-row">
      <h6>
        <Link to={`/instructor-application/${applicationID}`}>{number}</Link>
      </h6>
      <h6>{name}</h6>
      <h6>{email}</h6>
      <h6 className="capitalize">{preferredCategory}</h6>
      <h6>{yearsOfExperience}</h6>
      <h6>{convertFireDateToString(dateCreated)}</h6>
    </div>
  )
}
