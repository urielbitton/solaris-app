import React, { useEffect, useState } from 'react'
import { getInstructorApplications } from "../../services/adminServices"
import ApplicationRow from "./ApplicationRow"
import './styles/Admin.css'

export default function AdminInstructorApplications() {

  const [allApplications, setAllApplications] = useState([])

  const allApplicationsRender = allApplications?.map((application, i) => {
    return <ApplicationRow 
      application={application} 
      key={i} 
    />
  })

  useEffect(() => {
    getInstructorApplications(setAllApplications, 20)
  },[])

  return (
    <div className="admin-section admin-instructor-applications">
      <section>
        <h4>Instructor Applications</h4>
        <div className="table">
          <header>
            <h5>Application #</h5>
            <h5>Applicant Name</h5>
            <h5>Email</h5>
            <h5>Category</h5>
            <h5>Years Of Experience</h5>
            <h5>Application Date</h5>
          </header>
          <div className="body">
            {allApplicationsRender}
          </div>
        </div>
      </section>
    </div>
  )
}
