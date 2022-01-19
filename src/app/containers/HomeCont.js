import React, { useContext, useEffect } from 'react'
import './styles/HomeCont.css'
import Navbar from '../components/layout/Navbar'
import { Route, Switch } from 'react-router'
import { useWindowDimensions } from "../utils/customHooks"
import Home from '../pages/Home'
import CoursePage from '../pages/CoursePage'
import AllCourses from '../pages/AllCourses'
import InstructorPage from '../pages/InstructorPage'
import Instructors from '../pages/Instructors'
import MyLibrary from '../pages/MyLibrary'
import Reports from '../pages/Reports'
import LessonPage from '../pages/LessonPage'
import CourseCheckout from '../pages/CourseCheckout'
import ProCheckout from '../pages/ProCheckout'
import CreatePage from '../pages/CreatePage'
import CreateCoursePage from '../pages/CreateCoursePage'
import { StoreContext } from '../store/store'
import ErrorPage from "../pages/ErrorPage"
import MyCourses from "../pages/MyCourses"
import BecomeInstructor from "../pages/BecomeInstructor"
import NotificationsPage from "../pages/NotificationsPage"
import CreateQuiz from "../pages/CreateQuiz"
import QuizPage from "../pages/QuizPage"
import QuizResults from "../pages/QuizResults"
import GetProPage from '../pages/GetProPage'
import WelcomePage from "../pages/WelcomePage"
import MyAccount from '../pages/MyAccount'

export default function HomeCont() {

  const {windowPadding, setWindowPadding, appBg, myUser, openSidebar, setOpenSidebar} = useContext(StoreContext)
  const { screenWidth } = useWindowDimensions()

  // useEffect(() => {
  //   if(screenWidth <= 1080) {
  //     setWindowPadding('100px 20px 0px 20px')
  //   }
  //   else {
  //     setWindowPadding('100px 30px 0px 30px')
  //   }
  // },[screenWidth])

  useEffect(() => {
    if(openSidebar) 
      window.onclick = () => setOpenSidebar(false)
  },[openSidebar])

  return (
    <div className="home-container">
      <Navbar />
      <div className="app-window" style={{padding: windowPadding, background: appBg}}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/courses">
            <AllCourses />
          </Route>
          <Route exact path="/courses/course/:courseID">
            <CoursePage />
          </Route>
          <Route exact path="/courses/course/:courseID/lesson/:lessonID/:videoID">
            <LessonPage />
          </Route>
          <Route exact path="/instructors">
            <Instructors />
          </Route>
          <Route exact path="/instructors/instructor/:instructorID">
            <InstructorPage />
          </Route>
          <Route path="/become-an-instructor">
            <BecomeInstructor />
          </Route>
          <Route path="/my-library">
            <MyLibrary />
          </Route>
          <Route path="/reports">
            <Reports />
          </Route>
          <Route path="/checkout/course/:courseID">
            <CourseCheckout />
          </Route>
          <Route exact path="/checkout/get-pro">
            <ProCheckout />
          </Route>
          <Route path="/notifications">
            <NotificationsPage />
          </Route>
          <Route path="/courses/course/:courseID/create/quiz">
            { myUser?.isInstructor && <CreateQuiz /> }
          </Route>
          <Route path="/courses/course/:courseID/create/quiz/:quizID?edit=true">
            { myUser?.isInstructor && <CreateQuiz /> }
          </Route>
          <Route exact path="/courses/:courseID/quiz/:quizID">
            <QuizPage />
          </Route>
          <Route path="/courses/:courseID/quiz/:quizID/results">
            <QuizResults />
          </Route>
          <Route path="/get-pro">
            <GetProPage />
          </Route>
          <Route exact path="/create">
            { myUser?.isInstructor && <CreatePage /> }
          </Route>
          <Route path="/create/create-course/:courseType">
            { myUser?.isInstructor && <CreateCoursePage editMode={false} /> }
          </Route>
          <Route path="/courses/my-courses">
            { myUser?.isInstructor && <MyCourses /> }
          </Route>
          <Route path="/edit-course/:courseID">
            <CreateCoursePage editMode />
          </Route>
          <Route exact path="/welcome">
            <WelcomePage />
          </Route>
          <Route path="/my-account">
            <MyAccount />
          </Route>
          <Route exact path="*" component={ErrorPage} />
        </Switch>
      </div>
    </div>
  )
}
