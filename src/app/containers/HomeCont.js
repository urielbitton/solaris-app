import React from 'react'
import './styles/HomeCont.css'
import Navbar from '../components/Navbar'
import { Route, Switch } from 'react-router'
import Home from '../pages/Home'
import CoursePage from '../pages/CoursePage'
import AllCourses from '../pages/AllCourses'
import InstructorPage from '../pages/InstructorPage'
import Instructors from '../pages/Instructors'
import MyLibrary from '../pages/MyLibrary'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'
import LessonPage from '../pages/LessonPage'
import Checkout from '../pages/Checkout'
import CreatePage from '../pages/CreatePage'

export default function HomeCont() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="app-window">
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
          <Route path="/my-library">
            <MyLibrary />
          </Route>
          <Route path="/reports">
            <Reports />
          </Route>
          <Route exact path="/settings">
            <Settings />
          </Route>
          <Route path="/checkout/course/:courseID">
            <Checkout />
          </Route>
          <Route exact path="/create">
            <CreatePage />
          </Route>
        </Switch>
      </div>
    </div>
  )
}
