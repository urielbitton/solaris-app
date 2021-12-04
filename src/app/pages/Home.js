import React, { useContext, useEffect, useState } from 'react'
import CourseCard from '../components/CourseCard'
import { getCoursesByClass } from '../services/courseServices'
import './styles/Home.css'
import {StoreContext} from '../store/store'

export default function Home() {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)
  const [featuredCourses, setFeaturedCourses]= useState([])

  const featuredRender = featuredCourses?.map((course,i) => {
    return <CourseCard course={course} key={i}/>
  })

  useEffect(() => {
    getCoursesByClass('featured', setFeaturedCourses, 4)
  },[])

  useEffect(() => {
    setNavTitle('Home')
    setNavDescript('Welcome Jennifer')
  }, [])

  return (
    <div className="home-page">
      <section className="full">
        <div className="titles-row">
          <h3>Featured Courses</h3>
          <small>View All</small>
        </div>
        <div className="courses-row">
          {featuredRender}
        </div>
      </section>
      <section className="full">
        <div className="titles-row">
          <h3>New Courses</h3>
          <small>View All</small>
        </div>
      </section>
      <section className="full">
        <div className="titles-row">
          <h3>All Courses</h3>
          <small>View All</small>
        </div>
      </section>
    </div>
  )
}
