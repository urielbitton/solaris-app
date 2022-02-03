import React, { useContext, useEffect, useState } from 'react'
import './styles/MyStudents.css'
import { StoreContext } from '../store/store'
import { getCoursesByInstructorID } from "../services/InstructorServices"
import { getAllQuizzesByCourseID, getStudentsByCourseID } from '../services/courseServices'
import { getUserCertificationsByCourseID, getUserByID, getUserQuizzesByCourseList } from '../services/userServices'
import { convertFireDateToString } from '../utils/utilities'
import StudentAvatar from '../components/student/StudentAvatar'
import { Link, useHistory } from "react-router-dom"
import { AppSelect } from '../components/ui/AppInputs'
import { updateSubDB } from '../services/CrudDB'

export default function MyStudents() {

  const { setNavTitle, setNavDescript, myUser } = useContext(StoreContext)
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [currentCourse, setCurrentCourse] = useState({})
  const [openSlide, setOpenSlide] = useState(false)
  const [currentStudent, setCurrentStudent] = useState({})
  const [courseQuizes, setCourseQuizes] = useState([])
  const [currentCourseQuizes, setCurrentCourseQuizes] = useState([])
  const [userCertifications, setUserCertifications] = useState([])
  const [completedCourse, setCompletedCourse] = useState(false)
  const [dateJoined, setDateJoined] = useState(null)
  const history = useHistory()

  const completionOptions = [
    {name: 'Yes', value: true},
    {name: 'No', value: false}
  ]
  
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
      subtitle="View Info"
      subtitleClick={(e) => viewStudentInfo(e, student)}
      key={i}
    />
  })

  const currentCourseUserQuizesRender = currentCourseQuizes?.map((quiz, i) => {
    return <div className="info-row" key={i}>
      <div>
        <h5>
          <i className="fal fa-align-center"></i>
          {quiz.quizName}
        </h5>
      </div>
      <Link 
        className="linkable" 
        to={`/courses/${currentCourse?.id}/quiz/${quiz.quizID}/${currentStudent?.userID}/results?edit=true`}
      >
        Review / Grade
      </Link>
    </div>
  })

  const currentCourseUserCertificationsRender = userCertifications?.map((certification, i) => {
    return <div className="info-row column" key={i}>
      <div>
        <h5>
          <i className="fas fa-certificate"></i>
          {certification.name}
        </h5>
        <span>Course: {certification.courseName}</span>
      </div>
      <Link 
        className="linkable" 
        to={`/certifications/${currentStudent.userID}`}
      >
        View
      </Link>
    </div>
  })

  const viewStudentInfo = (e, student) => {
    e.stopPropagation()
    setOpenSlide(true)
    getUserByID(student.userID, setCurrentStudent)
    getUserCertificationsByCourseID(student.userID, currentCourse?.id, setUserCertifications)
    setCompletedCourse(student.hasCompleted)
    setDateJoined(student.dateJoined)
    getUserQuizzesByCourseList(student.userID, courseQuizes.map((x) => x.quizID), setCurrentCourseQuizes)
  }

  const handleCompletionUpdate = (e) => {
    setCompletedCourse(e.target.value)
    updateSubDB('courses', currentCourse?.id, 'students', currentStudent.userID, {
      hasCompleted: e.target.value
    })
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
    getAllQuizzesByCourseID(currentCourse?.id, setCourseQuizes)
  },[currentCourse])

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
          {
            currentCourse.id ?
            <>
              <h3>Enrolled Students ({students.length})</h3>
              <div className="students-flex">
                { students.length ? studentsListRender : <span>There are no students enrolled in this course yet.</span>}
              </div> 
            </>:
            <div className="students-flex">
              <span>Please select a course.</span>
            </div>
          }
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
          <h3>General</h3>
          <div>
            <h6>Date Joined</h6>
            <span>{dateJoined && convertFireDateToString(dateJoined)}</span>
          </div>
          <div>
            <h6>Completed Course</h6>
            <span className="badge">{completedCourse ? "Completed" : "In Progress"}</span>
          </div>
          <div>
            <h6>Change Student Completion Status</h6>
            <AppSelect 
              options={completionOptions}
              onChange={(e) => handleCompletionUpdate(e)}
              value={completedCourse ? 'yes' : 'no'}
            />
          </div>
        </section>
        <section>
          <h3>Quizes</h3>
          {currentCourseUserQuizesRender}
        </section>
        <section>
          <h3>Certifications</h3>
          {currentCourseUserCertificationsRender}
        </section>
        <section>
          <h3>Profile</h3>
          <button 
            onClick={() => history.push(`/profile/${currentStudent?.userID}`)}
            className="shadow-hover"
          >
            View Profile
          </button>
        </section>
      </div>
    </div>
  )
}
