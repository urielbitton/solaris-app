import React, { useContext, useEffect, useState } from 'react'
import { getAllCourses, getFeaturedCourses, getNewCourses } from '../services/courseServices'
import './styles/Home.css'
import {StoreContext} from '../store/store'
import { Link } from 'react-router-dom'
import CoursesGrid from '../components/course/CoursesGrid'
import { getTopRatedInstructors } from "../services/InstructorServices"
import InstructorCard from '../components/instructor/InstructorCard'
import { getCoursesIDEnrolledByUserID } from "../services/userServices"
import onlineLearningImg from '../assets/imgs/online-learning.png'
import { db } from "../firebase/fire"

export default function Home() {

  const {setNavTitle, setNavDescript, user, myUser} = useContext(StoreContext)
  const [featuredCourses, setFeaturedCourses]= useState([])
  const [newCourses, setNewCourses] =  useState([])
  const [allCourses, setAllCourses] = useState([])
  const [topInstructors, setTopInstructors] = useState([])
  const [coursesEnrolled, setCoursesEnrolled] = useState([])
  const withinAMonth = new Date(Date.now() - 2592000000)
  const withinAWeek = new Date(Date.now() - 1814400000)

  const topInstructorsRender = topInstructors?.map((instructor, i) => {
    return <InstructorCard instructor={instructor} key={i} />
  })

  useEffect(() => {
    getFeaturedCourses(setFeaturedCourses, 4)
    getNewCourses(withinAWeek, setNewCourses, 4)
    getAllCourses(setAllCourses, 4)
    getTopRatedInstructors(4.5, setTopInstructors, Infinity)
    getCoursesIDEnrolledByUserID(user?.uid, setCoursesEnrolled)
  },[])

  useEffect(() => {
    setNavTitle('Home')
    setNavDescript(`Welcome ${myUser?.firstName} ${myUser?.lastName}`)
  },[myUser]) 

  return (
    <div className="home-page">
      <section className="intro">
        <div> 
          <h4>Hi {user?.displayName}</h4>
          <h6>{new Date().toDateString('en-CA', {weekday: 'long', month: 'long'})}</h6>
          <span>You are enrolled in {coursesEnrolled.length} course{coursesEnrolled.length !== 1 ? "s" : ""}</span>
        </div>
        <img src={onlineLearningImg} alt="" />
      </section>
      <section className="full">
        <div className="titles-row">
          <h3>Featured Courses</h3>
          <small>
            <Link to="/courses?q=featured" className="linkable">View All</Link>
          </small>
        </div>
        <div className="courses-row">
          <CoursesGrid courses={featuredCourses}/>
        </div>
      </section>
      <section className="full">
        <div className="titles-row">
          <h3>New Courses</h3>
          <small>
            <Link to="/courses?q=new" className="linkable">View All</Link>
          </small>
        </div>
        <div className="courses-row">
          <CoursesGrid courses={newCourses} noskeleton />
        </div>
      </section>
      <section className="full">
        <div className="titles-row">
          <h3>All Courses</h3>
          <small>
            <Link to="/courses" className="linkable">View All</Link>
          </small>
        </div>
        <div className="courses-row">
          <CoursesGrid courses={allCourses} />
        </div>
      </section>
      <section className="full">
        <h3>Top Rated Instructors</h3>
        <div className="instructors-row">
          {topInstructorsRender}
        </div>
      </section>
      <section className="full">
        <h3>Latest Tutorials</h3>
      </section>
      <div className="spacer-m"></div>
    </div>
  )
}
