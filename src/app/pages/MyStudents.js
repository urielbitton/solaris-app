import React, { useContext, useEffect, useState } from 'react'
import './styles/MyStudents.css'
import { StoreContext } from '../store/store'
import { getCoursesByInstructorID } from "../services/InstructorServices"
import { getStudentsByCourseID } from '../services/courseServices'
import { getUserByID } from '../services/userServices'
import StudentAvatar from '../components/student/StudentAvatar'

export default function MyStudents() {

  const { setNavTitle, setNavDescript, myUser } = useContext(StoreContext)
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [currentCourse, setCurrentCourse] = useState({})
  const [openSlide, setOpenSlide] = useState(false)
  const [currentStudent, setCurrentStudent] = useState({})
  
  const coursesListRender = courses?.map((course, i) => {
    return <div 
      className={`course-row ${currentCourse?.id === course?.id ? 'active' : ''}`}
      onClick={() => setCurrentCourse(course)} 
      key={i}
    >
      <h4>{course.title}</h4>
      <i className="fal fa-arrow-right"></i>
    </div>
  }) 

  const studentsListRender = students?.map((student, i) => {
    return <StudentAvatar 
      name={student.name}
      photoURL={student.photoURL}
      userID={student.userID}
      clickable
      subtitle="View Info"
      subtitleClick={(e) => viewStudentInfo(e, student)}
      key={i}
    />
  })

  const viewStudentInfo = (e, student) => {
    e.stopPropagation()
    setOpenSlide(true)
    getUserByID(student.userID, setCurrentStudent)
  }

  useEffect(() => {
    setNavTitle('My Students')
    setNavDescript('')
    if(myUser?.instructorID) {
      getCoursesByInstructorID(myUser?.instructorID, setCourses, 20)
    }
  },[myUser])

  useEffect(() => {
    getStudentsByCourseID(currentCourse?.id, setStudents, 40)
  },[currentCourse])

  useEffect(() => {
    if(courses.length) {
      setCurrentCourse(courses[0])
    }
  },[courses])

  useEffect(() => {
    if(openSlide) 
      window.onclick = () => setOpenSlide(false)
  },[openSlide])

  return (
    <div className="my-students-page">
      <div className="side-bar">
        <header>
          <h3>Select a Course</h3>
          <small>{courses.length} course{courses.length !== 1 ? 's' : ''}</small>
        </header>
        <div className="courses-list">
          { courses.length ? coursesListRender : <span>You have no courses yet.</span>}
        </div>
      </div>
      <div className="main-content">
        <section>
          <h2>{currentCourse?.title}</h2>
        </section>
        <section>
          <h3>Enrolled Students ({students.length})</h3>
          <div className="students-flex">
            { students.length ? studentsListRender : <span>There are no students enrolled in this course yet.</span>}
          </div>
        </section>
      </div>
      <div 
        className={`slide-bar ${openSlide ? 'open' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          <img src={currentStudent?.photoURL} alt=""/>
          <h3>{currentStudent?.firstName} {currentStudent?.lastName}</h3>
          <h4>{currentStudent?.email}</h4>
        </header>
        <section>
          <h3>Quizes</h3>
        </section>
        <section>
          <h3>Certifications</h3>
        </section>
      </div>
    </div>
  )
}
