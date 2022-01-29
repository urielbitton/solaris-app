import React from 'react'
import { convertFireDateToString, truncateText } from '../../utils/utilities'

export default function IncidentRow(props) {

  const { incidentNumber, text, incidentType, commentID, reason,
    reporterName, reporterID, isResolved, dateAdded, resolveComment } = props.incident
  const { incident, setCurrentIncident, setShowModal } = props

  return (
    <div 
      className="admin-row incident-row"
      onClick={() => {
        setCurrentIncident(incident)
        setShowModal(true)
      }}
    >
      <h6>{incidentNumber}</h6>
      <h6 className="long">{truncateText(text, 60)}</h6>
      <h6 title={`commentID: ${commentID}`}>{incidentType}</h6>
      <h6>{reason}</h6>
      <h6 title={`Reporter ID: ${reporterID}`}>{reporterName}</h6>
      <h6 className="status" title={resolveComment ? `Resolve Comment: ${resolveComment}` : ''}>
        <span 
          className={isResolved ? 'good' : 'bad'}
        >
          {isResolved ? 'Resolved' : 'Unresolved'}
        </span>
      </h6>
      <h6>{convertFireDateToString(dateAdded)}</h6>
    </div>
  )
}
