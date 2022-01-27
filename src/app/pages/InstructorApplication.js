import React, { useContext, useEffect, useState } from 'react'
import './styles/InstructorApplication.css'
import { StoreContext } from '../store/store'
import { useRouteMatch } from "react-router-dom"
import { getInstructorApplicationByID } from "../services/adminServices"
import { getUserByID } from '../services/userServices'
import StudentAvatar from '../components/student/StudentAvatar'
import { convertFireDateToString, formatPhoneNumber } from '../utils/utilities'
import { useHistory } from "react-router-dom"
import { updateDB } from '../services/CrudDB'
import PageLoader from '../components/ui/PageLoader'

export default function InstructorApplication() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)
  const applicationID = useRouteMatch('/instructor-application/:applicationID').params.applicationID
  const [application, setApplication] = useState({})
  const [applicationUser, setApplicationUser] = useState({})
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const approveApplication = () => {
    setLoading(true)
    updateDB('instructorApplications', application?.applicationID, {
      isApproved: true
    })
    .then(() => setLoading(false))
    .catch(err => {
      setLoading(false)
      console.log(err)
    })
  }

  const rejectApplication = () => {
    setLoading(true)
    updateDB('instructorApplications', application?.applicationID, {
      isApproved: false
    })
    .then(() => setLoading(false))
    .catch(err => {
      setLoading(false)
      console.log(err)
    })
  }

  const approveAndCreated = () => {

  }

  useEffect(() => {
    getInstructorApplicationByID(applicationID, setApplication)
  },[applicationID])

  useEffect(() => {
    getUserByID(application?.userID, setApplicationUser)
  },[application])

  useEffect(() => {
    if(applicationUser === undefined) {
      getUserByID(application?.userID, setApplicationUser)
    }
  },[applicationUser])
    
  useEffect(() => {
    setNavTitle('Applications')
    setNavDescript('Instructor Application')
  },[])

  return (
    <div className="instructor-application-page">
      <div className="side-bar">
        <StudentAvatar 
          name={`${applicationUser?.firstName} ${applicationUser?.lastName}`}
          photoURL={applicationUser?.photoURL}
          subtitle={`${applicationUser?.city}, ${applicationUser?.country}`}
        />
        <section>
          <h5>About {applicationUser?.firstName}</h5>
          <small>{applicationUser?.aboutMe}</small>
        </section>
        <section>
          <h5>Other Info</h5>
          <small>Member Type <span>{applicationUser?.isProMember ? 'Pro Member' : 'Basic Member'}</span></small>
          <small>
            Website 
            <span>
              <a href={`https://${applicationUser?.website}`}>{applicationUser?.website}</a>
            </span>
          </small>
          <small>Phone <span>{formatPhoneNumber(applicationUser?.phone)}</span></small>
        </section>
        <button 
          className="shadow-hover"
          onClick={() => history.push(`/profile/${applicationUser?.userID}`)}
        >View User Profile</button>
      </div>
      <div className="main-content">
        <h3>
          Application Number: {application?.number}
          {
            application?.isApproved !== null ? 
            <span className={application?.isApproved ? 'approved' : 'rejected'}>{application?.isApproved ? ' - Approved' : ' - Rejected'}</span> :
            ''
          }
        </h3>
        <section>
          <h6>
            Applicant Name
            <span>{application.name}</span>
          </h6>
          <h6>
            Applicant Email
            <span>{application.email}</span>
          </h6>
          <h6>
            Date of Application
            <span>{convertFireDateToString(application?.dateCreated)}</span>
          </h6>
          <h6>
            Reason for Application
            <span>{application?.reasonsToApply}</span>
          </h6>
          <h6>
            Applicant has Teaching Certificate
            <span>{application?.hasCertificate ? 'Yes' : 'No'}</span>
          </h6>
          <h6>
            Preferred Category
            <span>{application?.preferredCategory}</span>
          </h6>
          <h6 className="column">
            Biography
            <div className="text-container">
              <span>{application?.bio}</span>
            </div>
          </h6>
          <h6>
            Resume
            <span>{application?.resume}</span>
          </h6>
          <h6>
            Years Of Teaching Experience
            <span>{application?.yearsOfExperience}</span>
          </h6>
        </section>
        <hr/>
        <div className="btn-group">
          <button onClick={() => approveApplication()}>Approve</button>
          <button onClick={() => rejectApplication()} className="reject-btn">Reject</button>
          <button onClick={() => approveAndCreated()}>Approve & Create Instructor</button>
        </div>
      </div>
      <PageLoader loading={loading} />
    </div>
  )
}
