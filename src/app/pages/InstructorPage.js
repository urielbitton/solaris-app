import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { getCoursesByInstructorID, getFollowersByInstructorID, getInstructorByID, getReviewsByInstructorID } from '../services/InstructorServices'
import './styles/InstructorPage.css'
import {StoreContext} from '../store/store'
import SocialLinks from '../components/ui/SocialLinks'
import FollowInstructorBtn from "../components/instructor/FollowInstructorBtn"
import CoursesGrid from "../components/course/CoursesGrid"
import AppModal from '../components/ui/AppModal'
import StudentAvatar from '../components/student/StudentAvatar'
import { getUserByID } from "../services/userServices"
import InstructorReviews from '../components/instructor/InstructorReviews'
import WriteInstructorReview from '../components/instructor/WriteInstructorReview'

export default function InstructorPage() {

  const {setNavTitle, setNavDescript, user, myUser} = useContext(StoreContext)
  const [instructor, setInstructor] = useState({})
  const [courses, setCourses] = useState([])
  const [coursesLimit, setCoursesLimit] = useState(10)
  const [followers, setFollowers] = useState([])
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const instructorID = useRouteMatch('/instructors/instructor/:instructorID')?.params.instructorID
  const isCurrentUserFollowing = followers?.findIndex(x => x.userID === user?.uid) > -1

  const followersList = followers?.map((follower, i) => {
    return <FollowersAvatar 
      follower={follower} 
      key={i} 
    />
  })

  useEffect(() => {
    getInstructorByID(instructorID, setInstructor)
    getCoursesByInstructorID(instructorID, setCourses, coursesLimit)
    getFollowersByInstructorID(instructorID, setFollowers)
    setNavTitle('Instructor')
  },[instructorID])

  useEffect(() => {
    setNavDescript(instructor?.name)
  },[instructor])

  return (
    <div className="instructor-page">
      <div className="profile-row">
        <img src={instructor?.profilePic} className="profile-pic" alt="" />
        <div className="instructor-info">
          <h1>{instructor?.name}</h1>
          <h5>{instructor?.title}</h5>
          <h4>Bio</h4>
          <p>{instructor?.bio}</p>
        </div>
        <hr/>
        <div className="socials-section">
          <SocialLinks 
            facebook
            twitter
            linkedin
            facebookUrl={instructor?.facebookUrl}
            twitterUrl={instructor?.twitterUrl}
            linkedinUrl={instructor?.linkedinUrl}
          />
          <h5 onClick={() => setShowFollowersModal(true)}>
            <i className="fal fa-user-friends"></i>
            <span>{instructor?.followersCount} follower{instructor?.followersCount !== 1 ? "s" : ""}</span>
          </h5>
          <FollowInstructorBtn 
            isCurrentUserFollowing={isCurrentUserFollowing}
            instructor={instructor}
            currentUserID={user?.uid}
            myUser={myUser}
          />
        </div>
      </div>
      <div className="instructor-stats-container">
        <div>
          <big>{instructor?.coursesTaught?.length}</big>
          <h5>Course{instructor?.coursesTaught?.length !== 1 ? "s" : ""} Taught</h5>
        </div>
        <hr/>
        <div>
          <big>{instructor?.reviewsCount}</big>
          <h5>Review{instructor?.reviewsCount !== 1 ? "s" : ""}</h5>
        </div>
        <hr/>
        <div>
          <big>{instructor?.rating}</big>
          <h5>Average Rating</h5>
        </div>
      </div>
      <div className="courses-grid-container">
        <h3>Courses by {instructor?.name}</h3>
        <CoursesGrid courses={courses} />
      </div>
      <InstructorReviews  
        instructor={instructor} 
        instructorID={instructorID}
        reviewsCount={instructor?.reviewsCount}
        rating={instructor?.rating}
      />
      {
        myUser?.instructorID !== instructorID ?
        <WriteInstructorReview 
          instructor={instructor}
          instructorID={instructorID}
        /> :
        <></>
      }
      <AppModal
        title={`${instructor?.name}'s Followers`}
        showModal={showFollowersModal}
        setShowModal={setShowFollowersModal}
        actions={
          <button onClick={() => setShowFollowersModal(false)}>Done</button>
        }
      >
        <div className="followers-flex">
          {followersList}
        </div>
      </AppModal>
    </div>
  )
}

export function FollowersAvatar({follower}) {

  const [followerUser, setFollowerUser] = useState({})

  useEffect(() => {
    getUserByID(follower?.userID, setFollowerUser)
  },[])

  return <StudentAvatar 
    name={follower.name}
    userID={follower.userID}
    photoURL={followerUser?.photoURL}
    clickable
  />
}