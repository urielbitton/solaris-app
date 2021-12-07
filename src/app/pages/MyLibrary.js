import React, { useContext, useEffect, useState } from 'react'
import {StoreContext} from '../store/store'
import PageSearch from '../components/PageSearch'
import './styles/MyLibrary.css'
import { getCoursesIDEnrolledByUserID, getCoursesEnrolledByUserID } from '../services/userServices'
import CoursesGrid from '../components/CoursesGrid'

export default function MyLibrary() {

  const {setNavTitle, setNavDescript, user} = useContext(StoreContext)
  const [coursesIDs, setCoursesIDs] = useState([])
  const [courses, setCourses] = useState([])
  const enrolledList = coursesIDs.map(x => x.courseID)

  useEffect(() => {
    getCoursesIDEnrolledByUserID(user.uid, setCoursesIDs)
  },[user])

  useEffect(() => {
    getCoursesEnrolledByUserID(enrolledList, setCourses)
  },[coursesIDs])

  useEffect(() => {
    setNavTitle('My Library')
    setNavDescript('x courses in library')
  },[])

  return (
    <div className="my-library-page">
      <PageSearch 
        title="Find A Course"
        description="Search by course name, ID, instructor or category"
      />
      <h3>Enrolled Courses</h3>
      <CoursesGrid courses={courses} />
    </div>
  )
}
