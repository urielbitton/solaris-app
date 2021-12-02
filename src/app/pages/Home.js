import React, { useEffect, useState } from 'react'
import CourseCard from '../components/CourseCard'
import { getCoursesByClass } from '../services/courseServices'
import './styles/Home.css'

export default function Home() {

  const [featuredCourses, setFeaturedCourses]= useState([])
  console.log(featuredCourses)

  const featuredRender = featuredCourses?.map((course,i) => {
    return <CourseCard course={course} key={i}/>
  })

  useEffect(() => {
    getCoursesByClass('featured', setFeaturedCourses)
  },[])

  return (
    <div className="home-page">
      <section className="full">
        <h3>Featured Courses</h3>
        <div className="courses-row">
          {featuredRender}
        </div>
      </section>
      <section className="full">
        <h3>New Courses</h3>
      </section>
      <section className="full">
        <h3>All Courses</h3>
      </section>
    </div>
  )
}
