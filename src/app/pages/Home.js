import React, { useContext, useEffect, useState } from 'react'
import CourseCard from '../components/CourseCard'
import { getAllCourses, getFeaturedCourses, getNewCourses } from '../services/courseServices'
import './styles/Home.css'
import {StoreContext} from '../store/store'
import { Link } from 'react-router-dom'
import CoursesGrid from '../components/CoursesGrid'

export default function Home() {

  const {setNavTitle, setNavDescript, user} = useContext(StoreContext)
  const [featuredCourses, setFeaturedCourses]= useState([])
  const [newCourses, setNewCourses] =  useState([])
  const [allCourses, setAllCourses] = useState([])
  const lessThanAMonth = new Date(Date.now() - 2592000000)

  useEffect(() => {
    getFeaturedCourses(setFeaturedCourses, 4)
    getNewCourses(lessThanAMonth, setNewCourses, 4)
    getAllCourses(setAllCourses, 4)
  },[])

  useEffect(() => {
    setNavTitle('Home')
    setNavDescript('Welcome ' + user?.displayName?.split(' ')[0])
  },[])

  return (
    <div className="home-page">
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
          <CoursesGrid courses={newCourses} />
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
    </div>
  )
}
