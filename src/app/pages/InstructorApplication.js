import React, { useContext, useEffect, useState } from 'react'
import './styles/InstructorApplication.css'
import { StoreContext } from '../store/store'
import { useRouteMatch } from "react-router-dom"
import { getInstructorApplicationByID } from "../services/adminServices"
import { getUserByID } from '../services/userServices'
import StudentAvatar from '../components/student/StudentAvatar'
import { convertFireDateToString, formatPhoneNumber } from '../utils/utilities'
import { useHistory } from "react-router-dom"
import { addSubDB, setDB, updateDB } from '../services/CrudDB'
import PageLoader from '../components/ui/PageLoader'
import { db } from "../firebase/fire"
import { createNewNotification } from "../services/notificationsServices"

export default function InstructorApplication() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)
  const applicationID = useRouteMatch('/instructor-application/:applicationID').params.applicationID
  const [application, setApplication] = useState({})
  const [applicationUser, setApplicationUser] = useState({})
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const disableButton = applicationUser?.isInstructor

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
    .then(() => {
      setLoading(false)
      createNewNotification(
        application?.userID,
        'Instructor Application Rejected', 
        `Your instructor application was rejected. You can reach out to us by email or 
         submit a new application if you would like to update your details. Click here to submit a new application.`,
        `/become-an-instructor`,
        'fal fa-chalkboard-teacher'
      )
    })
    .catch(err => {
      setLoading(false)
      console.log(err)
    })
  }

  const approveAndCreate = () => {
    setLoading(true)
    updateDB('instructorApplications', application?.applicationID, {
      isApproved: true
    })
    .then(() => {
      const genNewID = db.collection('instructors').doc().id
      setDB('instructors', genNewID, {
        bio: application?.bio,
        coursesTaught: [],
        dateJoined: new Date(),
        facebbookUrl: '',
        followersCount: 0,
        instructorID: genNewID,
        instructorUserID: applicationUser?.userID,
        linkedinUrl: '',
        name: application?.name,
        profilePic: applicationUser?.photoURL,
        rating: 0,
        reviewsCount: 0,
        title: application?.title,
        userID: applicationUser?.userID,
        yearsOfExperience: application?.yearsOfExperience
      })
      .then(() => {
        addSubDB('users', application?.userID, 'emails', {
          email: application?.email,
          subject: 'Solaris: New Instructor Application',
          html: `Hi ${application?.name},<br/><br/>We have reviewed your instructor application and are pleased to let you know
          that you have been approved as an instructor on Solaris!<br/>We wish you a heartfelt congratulations and we look
          foward to seeing what you have to teach on the platform. <br/><br/>Your instructor profile has been created for you and ready to 
          create courses, quizes and more. <br/><br/>To create your first course, please login to Solaris and
          click on the 'Create' tab on the left hand sidebar.<br/><br/>Congratulations again and see you on the platform!
          <br/><br/>Best regards,<br/><br/>The Solaris Team`,
          dateSent: new Date()
        })
        updateDB('users', application?.userID, {
          isInstructor: true,
          instructorID: genNewID,
          isStudent: false
        })
        createNewNotification(
          application?.userID,
          'Instructor Application Accepted', 
          `Congratulations! Your instructor application has been approved and your instructor profile has been created for you.
           You can view your instructor profile here.`,
          `/instructors/instructor/${genNewID}`,
          'fal fa-chalkboard-teacher'
        )
        setLoading(false)
        history.push(`/instructors/instructor/${genNewID}`)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
    })
    .catch(err => {
      setLoading(false)
      console.log(err)
    })
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
            <div className="text-container bio">
              <span>{application?.bio}</span>
            </div>
          </h6>
          <h6>
            Resume
            <span>
              <a 
                href={application?.resume}
                target="_blank"
                rel="noreferrer"
              >
                <i className="far fa-file-pdf"></i>
                Resume
              </a>
            </span>
          </h6>
          <h6>
            Years Of Teaching Experience
            <span>{application?.yearsOfExperience}</span>
          </h6>
          <h6>
            Title
            <span>{application?.title}</span>
          </h6>
        </section>
        <hr/>
        <div className="btn-group">
          <button 
            onClick={() => approveApplication()}
            disabled={disableButton}
          >Approve</button>
          <button 
            onClick={() => approveAndCreate()}
            disabled={disableButton}
          >Approve & Create Instructor</button>
          <button 
            onClick={() => rejectApplication()} 
            disabled={disableButton}
            className="reject-btn"
          >Reject</button>
        </div>
      </div>
      <PageLoader loading={loading} />
    </div>
  )
}
