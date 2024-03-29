import React from 'react'
import { convertFireDateToString, truncateText } from '../../utils/utilities'

export default function EmailRow(props) {

  const { email, setCurrentEmail, setShowModal } = props
  const { message, delivery, to } = props.email
  const { email: adminEmail } = props.adminInfo

  return (
    <div 
      className="admin-row email-row"
      onClick={() => {
        setCurrentEmail(email)
        setShowModal(true)
      }}
    >
      <h6 title={to} className="medium">{truncateText(to, 25)}</h6>
      <h6 title={adminEmail} className="medium">{truncateText(adminEmail, 25)}</h6>
      <h6>{message.subject}</h6>
      <h6 className="long">
        <div 
          dangerouslySetInnerHTML={{ __html: truncateText(message.html.replaceAll('<br/>',''), 70) }} 
          className="email-body"
        />
      </h6>
      <h6 className="status">
        <span className={delivery.state === 'SUCCESS' ? 'good' : 'bad'}>{delivery.state?.toLowerCase()}</span>
      </h6>
      <h6>{convertFireDateToString(delivery.endTime)}</h6>
    </div>
  )
}
