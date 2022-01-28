import React from 'react'
import { useHistory } from "react-router-dom"
import { convertFireDateToString } from '../../utils/utilities'

export default function ApplicationRow(props) {

  const { number, applicationID, name, email, preferredCategory, 
    yearsOfExperience, dateCreated, isApproved } = props.application
  const history = useHistory()

  return (
    <div 
      className="admin-row application-row"
      onClick={() => history.push(`/instructor-application/${applicationID}`)}
    >
      <h6>{number}</h6>
      <h6>{name}</h6>
      <h6>{email}</h6>
      <h6 className="capitalize">{preferredCategory}</h6>
      <h6>{yearsOfExperience}</h6>
      <h6 className="status">
        <span
          className={isApproved !== null ? isApproved ? 'good' : 'bad' : ''}
        >{isApproved !== null ? isApproved ? 'Approved' : 'Rejected' : 'Unreviewed'}</span>
      </h6>
      <h6>{convertFireDateToString(dateCreated)}</h6>
    </div>
  )
}
