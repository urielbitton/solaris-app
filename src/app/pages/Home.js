import React, { useEffect, useState } from 'react'
import CourseCard from '../components/CourseCard'
import { getCoursesByClass } from '../services/courseServices'
import './styles/Home.css'

export default function Home() {

  const [featuredCourses, setFeaturedCourses]= useState([])

  const featuredRender = featuredCourses?.map((course,i) => {
    return <CourseCard course={course} key={i}/>
  })

  useEffect(() => {
    getCoursesByClass('featured', setFeaturedCourses, 4)
  },[])

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
