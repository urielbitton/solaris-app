import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { Link } from 'react-router-dom'
import { getAllQuizzesByCourseID, getCourseByID, getLessonsByCourseID, getStudentsByCourseID } from '../services/courseServices'
import { getInstructorByID, getReviewsByInstructorID } from '../services/InstructorServices'
import './styles/CoursePage.css'
import placeholderImg from '../assets/imgs/placeholder.png'
import LessonsList from '../components/course/LessonsList'
import CourseReviews from '../components/course/CourseReviews'
import WriteComment from '../components/course/WriteComment'
import { StoreContext } from '../store/store'
import { getCoursesIDEnrolledByUserID } from '../services/userServices'
import { useLocation } from 'react-router'
import { useWindowDimensions } from "../utils/customHooks"
import QuizCard from "../components/quiz/QuizCard"
import StudentAvatar from "../components/student/StudentAvatar"

export default function CoursePage() {

  const {setNavTitle, setNavDescript, user, myUser} = useContext(StoreContext)
  const [course, setCourse] = useState({})
  const [instructor, setInstructor] = useState({})
  const [lessons, setLessons] = useState([])
  const [userCourses, setUserCourses] = useState([])
  const [instructorReviews, setInstructorReviews] = useState([])
  const [quizes, setQuizes] = useState([])
  const [students, setStudents] = useState([])
  const courseID = useRouteMatch('/courses/course/:courseID')?.params.courseID
  const courseUserAccess = userCourses.findIndex(x => x.courseID === courseID) > -1
  const isCourseInstructor = instructor?.instructorID === myUser?.instructorID
  const history = useHistory()
  const location = useLocation()
  const lessonsScrollRef = useRef()
  const quizesScrollRef = useRef()
  const { screenWidth } = useWindowDimensions()
  const isProMember = myUser?.isProMember

  const courseInfos = [
    {name: 'Course Level', icon: 'fas fa-layer-group', value: course?.difficulty},
    {name: 'Category', icon: 'fas fa-th', value: course?.category},
    {name: 'Course Duration', icon: 'fas fa-clock', value: course?.totalDuration},
    {name: 'Lessons', icon: 'fas fa-book-open', value: course?.lessonsCount},
    {name: 'Certificate', icon: 'fas fa-certificate', value: course?.hasCertificate?"Yes":"No"},
    {name: 'Language', icon: 'fas fa-language', value: course?.language},
  ]

  const courseInfosRender = courseInfos?.map((info,i) => {
    return <div className="row" key={i}>
      <h5>
        <i className={info.icon}></i>
        {info.name}
      </h5>
      <span>{info.value}</span>
    </div>
  })

  const whatYouLearnRender = course?.whatYouLearn?.map((el,i) => {
    return <span key={i}>
      <i className="far fa-check"></i>
      {el}
    </span>
  })

  const quizesRender = quizes?.map((quiz, i) => {
    return <QuizCard 
      quiz={quiz} 
      courseID={courseID}
      isCourseInstructor={isCourseInstructor}
      key={i} 
    />
  })

  const studentsRender = students?.map((student,i) => {
    return  <StudentAvatar 
      name={student.name}
      photoURL={student.photoURL}
      userID={student.userID}
      clickable
      key={i} 
    />
  })

  const enrollCourse = () => {
    history.push(`/checkout/course/${courseID}`)
  }

  useEffect(() => {
    getCourseByID(courseID, setCourse)
    getLessonsByCourseID(courseID, setLessons)
    getAllQuizzesByCourseID(courseID, setQuizes)
    getStudentsByCourseID(courseID, setStudents, 10)
  },[courseID])

  useEffect(() => {
    getInstructorByID(course?.instructorID, setInstructor)
    setNavTitle('Course')
    setNavDescript(course?.title) 
  },[course, courseID])

  useEffect(() => {
    getCoursesIDEnrolledByUserID(user?.uid, setUserCourses)
  },[user])

  useEffect(() => {
    getReviewsByInstructorID(course?.instructorID, setInstructorReviews, Infinity)
  },[course?.instructorID])

  useEffect(() => {
    if(location.search.includes('scrollToLessons')) {
      lessonsScrollRef.current.scrollIntoView()
    }
    else if(location.search.includes('scrollToQuizes')) {
      quizesScrollRef.current.scrollIntoView()
    }
  },[])

  useEffect(() => {
    if(instructor === undefined) {
      getInstructorByID(course?.instructorID, setInstructor)
    }
  },[instructor])

  return (
    <div className="course-page">
      <header className="banner">
        { (isCourseInstructor || myUser?.isAdmin) && <i className="far fa-pen edit-icon" onClick={() => history.push(`/edit-course/${courseID}`)}></i> }
        <div className="side">
          <small>{course?.category}</small>
          <h1>{course?.title}</h1>
          <h5>{course?.short}</h5>
          <div className="info-container">
            <div className="instructor-row">
              <span className="title">Instructor</span>
              <img src={instructor?.profilePic ?? placeholderImg} alt="" />
              <h6><Link to={`/instructors/instructor/${course?.instructorID}`} className="linkable">{instructor?.name}</Link></h6>
              <hr/>
              <span>{course?.studentsEnrolled} student{course?.studentsEnrolled !== 1 ? "s" : ""} enrolled</span>
            </div>
          </div>
        </div>
        <div className="side">
          <img src={course?.cover} className="cover-img" alt="" />
        </div>
      </header>
      <div className="course-content">
        <div className="text-container">
          <section>
            <h3>Course Overview</h3>
            <p className="course-description">{course?.description}</p>
          </section>
          <section>
            <h3>Course Summary</h3>
            <p className="course-description">{course?.summary}</p>
          </section>
          <section>
            <h3>What you'll learn in this course</h3>
            <div className="list-elements">
              {whatYouLearnRender} 
            </div>
          </section>
          <LessonsList 
            lessons={lessons}
            courseID={courseID}
            title="Course Content"
            courseUserAccess={courseUserAccess}
            videoTitleLength={screenWidth < 1370 ? 100 : 75}
            lessonsScrollRef={lessonsScrollRef}
          />
          {
            courseUserAccess && 
            <button 
              className='start-course-btn shadow-hover' 
              onClick={() => history.push(`/courses/course/${courseID}/lesson/${course.firstLessonID}/${course.firstVideoID}`)}
            >
              Start Now
            </button>
          }
          <section className="quiz-section">
            <div ref={quizesScrollRef} className="quiz-scroll-ref"/>
            <h3>Quizzes</h3>
            <div className="quiz-container">
              {quizesRender}
            </div>
            {
              isCourseInstructor ?
              <button 
                className="create-quiz-btn shadow-hover"
                onClick={() => history.push(`/courses/course/${courseID}/create/quiz`)}
              >
                Create Quiz
              </button> :
              ""
            }
          </section>
          <section>
            <h3>Instructor</h3>
            <div className="instructor-container">
              <div>
                <img src={instructor?.profilePic} alt="" />
                <div className="instructor-info">
                  <h2><Link to={`/instructors/instructor/${instructor?.instructorID}`}>{instructor?.name}</Link></h2>
                  <h5>{instructor?.title}</h5>
                  <div className="instructor-data">
                    <div>
                      <big>{instructor?.coursesTaught?.length}</big>
                      <span>Course{instructor?.coursesTaught?.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="border">
                      <big>{instructorReviews?.length}</big>
                      <span>Review{instructorReviews?.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="border">
                      <big>{instructor?.rating}</big>
                      <span>Rating</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="instructor-bio">
                <p>{instructor?.bio}</p>
              </div>
            </div>
          </section>
          <section>
            <h3>Students</h3>
            <div className="students-container">
              {studentsRender}
            </div>
          </section>
          <section>
            <CourseReviews
              course={course}
              courseID={courseID}
              numberOfReviews={course?.numberOfReviews}
              rating={course?.rating}
            />
          </section>
          <section>
            <WriteComment 
              course={course}
              instructor={instructor}
              courseID={courseID}
              writeType="review"
              mainTitle="Write A Review"
              titleInput="Review Title"
              messageInput="Review Summary"
              canReview={courseUserAccess}
            />
          </section>
          { 
            (isCourseInstructor || myUser?.isAdmin) && 
            <section>
              <div className="btn-group">
                <button 
                  className="shadow-hover"
                  onClick={() => history.push(`/edit-course/${courseID}`)}
                >Edit Course</button>
              </div>
            </section>
          }
        </div>
        <div className="course-info-container">
          <div className="course-info">
            <div className="header">
              <h4>Price</h4>
              <big title={isProMember && 'Free for pro members'}>
                {isProMember ? 'Free' : course?.price === 0 ? "Free" : "$"+course?.price}
              </big>
            </div>
            <div className="content">
              {courseInfosRender}
            </div>
            <div className="share-container">
              <h5>Share this course</h5>
              <div className="socials-container">
                <div className="social-icon facebook" style={{background:'#1877f2'}}>
                  <i className="fab fa-facebook-f"></i>
                </div>
                <div className="social-icon twitter" style={{background:'#1da1f2'}}>
                  <i className="fab fa-twitter"></i>
                </div>
                <div className="social-icon linkedin" style={{background:'#0a66c2'}}>
                  <i className="fab fa-linkedin-in"></i>
                </div>
              </div>
            </div>
            <button 
              className={courseUserAccess ? "enrollbtn enrolled" : "enrollbtn not-enrolled"} 
              onClick={() => courseUserAccess ? console.log('Already enrolled') : enrollCourse()}
            >
              {courseUserAccess ? "Enrolled" : "Enroll"}
              <i className={courseUserAccess ? "fal fa-check" : "fal fa-arrow-right"}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
