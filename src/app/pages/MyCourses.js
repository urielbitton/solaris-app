import React, { useContext, useEffect, useState } from 'react'
import './styles/MyCourses.css'
import PageSearch from '../components/PageSearch'
import { getCoursesByInstructorID } from '../services/InstructorServices'
import { StoreContext } from '../store/store'
import CoursesGrid from '../components/CoursesGrid'

export default function MyCourses() {

  const {myUser} = useContext(StoreContext)
  const [courses, setCourses] = useState([])
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    getCoursesByInstructorID(myUser?.instructorID, setCourses, limit)
  },[myUser])

  return (
    <div className="my-courses-page">
      <PageSearch 
        title="Find A Course"
        description="Search by course name, ID, instructor or category"
      />
      <h3>Courses i Teach</h3>
      <CoursesGrid courses={courses} />
    </div>
  )
}
