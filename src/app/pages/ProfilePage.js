import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom.min"
import './styles/ProfilePage.css'
import { getCertificationsByUserID, getCoursesEnrolledByUserID, getCoursesIDEnrolledByUserID, getUserByID } from '../services/userServices'
import StudentAvatar from '../components/student/StudentAvatar'
import { convertFireDateToMonthAndYear } from '../utils/utilities'
import CoursesGrid from '../components/course/CoursesGrid'
import { StoreContext } from "../store/store"
import { useHistory } from "react-router-dom"
import CertificationCard from "../components/course/CertificationCard"

export default function ProfilePage() {

  const { setNavTitle, setNavDescript, myUser } = useContext(StoreContext)
  const userID = useRouteMatch('/profile/:userID').params.userID
  const [profileUser, setProfileUser] = useState({})
  const [courses, setCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [certifications, setCertifications] = useState([])
  const enrolledCoursesList = enrolledCourses?.map((course) => course.courseID)
  const history = useHistory()
  const canViewCertificates = myUser?.userID === profileUser?.userID

  const certificationsRender = certifications?.map((certification, i) => {
    return <CertificationCard 
      certification={certification}
      key={i}
    />
  })

  useEffect(() => {
    getUserByID(userID, setProfileUser)
    getCoursesIDEnrolledByUserID(userID, setEnrolledCourses)
    getCertificationsByUserID(userID, setCertifications)
  },[userID])

  useEffect(() => {
    getCoursesEnrolledByUserID(enrolledCoursesList, setCourses)
  },[enrolledCourses])

  useEffect(() => {
    setNavTitle('My Profile')
    setNavDescript(`${profileUser?.firstName} ${profileUser?.lastName}'s Profile`)
  },[profileUser])

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <span className="type-badge">{profileUser?.isInstructor ? "Instructor" : "Student"}</span>
        <div className="profile">
        <StudentAvatar 
          name={`${profileUser?.firstName} ${profileUser?.lastName}`}
          photoURL={profileUser?.photoURL}
        />
        <small>
          <i className="far fa-map-marker-alt"></i>
          <span>{profileUser?.city}, {profileUser?.country}</span>
        </small>
        <small>Joined {convertFireDateToMonthAndYear(profileUser?.dateCreated)}</small>
        </div>
        <a href={`mailto:${profileUser?.email}`}>
          <button>
            <i className="far fa-envelope"></i>
            Email
          </button>
        </a>
        <small className="report-link">
          <i className="far fa-flag"></i>
          Report User
        </small>
        <div className="stats-container">
          <div>
            <i className="fal fa-graduation-cap"></i>
            <h5>{enrolledCourses.length}</h5>
            <h6>Enrolled Courses</h6>
          </div>
          <div>
            <i className="fal fa-diploma"></i>
            <h5>{certifications.length}</h5>
            <h6>Certifications Earned</h6>
          </div>
        </div>
        <hr/>
        <div className="about-me">
          <h6>About Me</h6>
          <p>
            {
              profileUser?.aboutMe?.length ?
              profileUser?.aboutMe :
              "I like to keep an air of mystery to my profile."
            }
          </p>
          { 
            profileUser?.website &&
            <a 
              href={`https://${profileUser?.website}`} 
              target="_blank" 
              rel="noreferrer"
            >
              <button className="shadow-hover">
                <i className="fal fa-link"></i>
                Website
              </button>
            </a>
          }
        </div>
      </div>
      <div className="profile-content">
        <section>
          <h3>Courses Enrolled</h3>
          {
            courses?.length ? 
            <CoursesGrid courses={courses} /> :
            <div className="no-courses">
              <h5>No enrolled courses yet.</h5>
              <button
                className="shadow-hover"
                onClick={() => history.push('/courses')}
              >View Courses</button>
            </div>
          }
        </section>
        <section style={{display : canViewCertificates ? 'flex' : 'none'}}>
          <h3>Course Certifications</h3>
          {
            certifications?.length ? 
            <div className="certification-flex">
              {certificationsRender}
            </div> :
            <div className="no-courses">
              <h5>No course certifications yet.</h5>
            </div>
          }
        </section>
      </div>
    </div>
  )
}
