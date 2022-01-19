import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { getCoursesByInstructorID, getFollowersByInstructorID, getInstructorByID, getReviewsByInstructorID } from '../services/InstructorServices'
import './styles/InstructorPage.css'
import {StoreContext} from '../store/store'
import SocialLinks from '../components/ui/SocialLinks'
import FollowInstructorBtn from "../components/instructor/FollowInstructorBtn"
import CoursesGrid from "../components/course/CoursesGrid"

export default function InstructorPage() {

  const {setNavTitle, setNavDescript, user, myUser} = useContext(StoreContext)
  const [instructor, setInstructor] = useState({})
  const [reviews, setReviews] = useState([])
  const [courses, setCourses] = useState([])
  const [coursesLimit, setCoursesLimit] = useState(10)
  const [followers, setFollowers] = useState([])
  const instructorID = useRouteMatch('/instructors/instructor/:instructorID')?.params.instructorID
  const reviewsNumTotal = reviews?.reduce((a,b) => a + b?.rating, 0)
  const ratingAvg = reviewsNumTotal / reviews.length
  const isCurrentUserFollowing = followers?.findIndex(x => x.userID === user?.uid) > -1

  useEffect(() => {
    getInstructorByID(instructorID, setInstructor)
    getReviewsByInstructorID(instructorID, setReviews, Infinity)
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
          <h5>
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
          <big>{instructor?.coursesTaught?.length}</big>
          <h5>Review{instructor?.reviewsCount !== 1 ? "s" : ""}</h5>
        </div>
        <hr/>
        <div>
          <big>{!isNaN(ratingAvg) ? ratingAvg.toFixed(2) : "0"}</big>
          <h5>Average Rating</h5>
        </div>
      </div>
      <div className="courses-grid-container">
        <h3>Courses</h3>
        <CoursesGrid courses={courses} />
      </div>
    </div>
  )
}
