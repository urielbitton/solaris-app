import React, { useEffect, useState } from 'react'
import './styles/Admin.css'
import { getAllCourses } from '../../services/courseServices'
import CourseRow from "./CourseRow"

export default function AdminHome() {

  const [allCourses, setAllCourses] = useState([])

  const allCoursesRender = allCourses?.map((course,i) => {
    return <CourseRow 
      course={course} 
      key={i} 
    />
  })

  useEffect(() => {
    getAllCourses(setAllCourses, 20)
  },[])

  return (
    <div className="admin-section admin-courses">
      <section>
        <h4>General</h4>
        <div className="table">
          <header>
            <h5>Course Title</h5>
            <h5>Price</h5>
            <h5>Instructor</h5>
            <h5>Students</h5>
            <h5>Rating</h5>
            <h5>Date Created</h5>
            <h5>Featured</h5>
          </header>
          <div className="body">
            {allCoursesRender}
          </div>
        </div>
      </section>
    </div>
  )
}

