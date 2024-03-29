import React, { useContext, useEffect, useState } from 'react'
import './styles/Account.css'
import { StoreContext } from '../../store/store'
import placeholderImg from '../../assets/imgs/placeholder.png'
import { getCertificationsByUserID, getCoursesIDEnrolledByUserID } from '../../services/userServices'
import { getCoursesByInstructorID } from '../../services/InstructorServices'
import { useHistory } from "react-router-dom"
import { uploadImgToFireStorage } from '../../services/storageServices'
import PageLoader from '../ui/PageLoader'
import { updateDB } from '../../services/CrudDB'

export default function AccountSidebar() {

  const { myUser, user } = useContext(StoreContext)
  const [imgUrl, setImgUrl] = useState('')
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [certifications, setCertifications] = useState([])
  const [coursesTaught, setCoursesTaught] = useState([])
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const uploadProfileImg = (e) => {
    setLoading(true)
    uploadImgToFireStorage(
      e,
      `users/${myUser?.userID}/photoURL`,
      'profile-img',
      setImgUrl
    )
    .then((url) => {
      updateDB('users', myUser?.userID, {
        photoURL: url
      })
      user.updateProfile({
        photoURL: url
      })
      .then(() => {
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
    })
    .catch((error) => {
      setLoading(false)
      console.log(error)
    })
  }

  useEffect(() => {
    setImgUrl(myUser?.photoURL)
    getCoursesIDEnrolledByUserID(myUser?.userID, setEnrolledCourses)
    getCertificationsByUserID(myUser?.userID, setCertifications)
    if(myUser?.isInstructor) {
      getCoursesByInstructorID(myUser?.instructorID, setCoursesTaught)
    }
  },[myUser])

  return (
    <div className="account-sidebar">
      <div className="avatar-container">
        <label onChange={(e) => uploadProfileImg(e)}>
          <input type="file" style={{display:'none'}} />
          <img src={myUser?.photoURL ? imgUrl : placeholderImg} alt="" />
          <div className="icon-container">
            <i className="fal fa-camera"></i>
          </div>
        </label>
      </div>
      <div className="titles">
        <h4>
          <span>{myUser?.firstName} {myUser?.lastName}</span>
          { myUser?.isProMember ?
            <i 
              className="fas fa-badge-check"
              title="Pro Member"
            ></i> :
            ""
          }
        </h4>
        <h6>{myUser?.isInstructor ? "Instructor" : "Student"}</h6>
      </div>
      <div className="quick-stats">
        <div>
          <h6>Courses Enrolled</h6>
          <span>{enrolledCourses?.length}</span>
        </div>
        <div>
          <h6>Certifications</h6>
          <span>{certifications?.length}</span>
        </div>
        {
          myUser?.isInstructor ?
          <div>
            <h6>Courses Taught</h6>
            <span>{coursesTaught?.length}</span>
          </div> :
          ""
        }
      </div>
      <div className="btn-group">
        <button
          className="profile-btn"
          onClick={() => history.push(`/profile/${myUser?.userID}`)}
        >
          <i className="fal fa-user"></i>
          My Profile
        </button>
        <button
          className="shadow-hover"
          onClick={() => history.push('/my-account/settings')}
        >
          <i className="fal fa-cog"></i>
          Settings
        </button>
      </div>
      <PageLoader loading={loading} />
    </div>
  )
}
