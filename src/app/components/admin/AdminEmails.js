import React, { useEffect, useState } from 'react'
import { getAdminAccountInfo, getAllEmails } from '../../services/adminServices'
import EmailRow from "./EmailRow"
import AppModal from '../ui/AppModal'

export default function AdminEmails() {

  const [allEmails, setAllEmails]  = useState([])
  const [adminInfo, setAdminInfo] = useState({})
  const [currentEmail, setCurrentEmail] = useState({})
  const [showModal, setShowModal] = useState(false)

  const allEmailsRender = allEmails?.map((email, i) => {
    return <EmailRow 
      email={email}
      adminInfo={adminInfo}
      setCurrentEmail={setCurrentEmail}
      setShowModal={setShowModal}
      key={i}
    />
  })

  useEffect(() => {
    getAllEmails(setAllEmails, 20)
    getAdminAccountInfo(setAdminInfo)
  },[])

  return (
    <div className="admin-section admin-emails">
      <section>
        <h4>Instructor Applications</h4>
        <div className="table">
          <header>
            <h5 className="medium">To</h5>
            <h5 className="medium">From</h5>
            <h5>Subject</h5>
            <h5 className="long">Message</h5>
            <h5>Delivery Status</h5>
            <h5>Date Sent</h5>
          </header>
          <div className="body">
            {allEmailsRender}
          </div>
        </div>
      </section>

      <AppModal
        title={currentEmail?.message?.subject}
        showModal={showModal}
        setShowModal={setShowModal}
      >
        <h5>To: <span>{currentEmail?.to}</span></h5>
        <div className="email-content">
          <div className="email-message">
          <div 
            dangerouslySetInnerHTML={{ __html: currentEmail?.message?.html }} 
            className="email-body"
          />
          </div>
        </div>
      </AppModal>
    </div>
  )
}
