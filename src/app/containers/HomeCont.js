import React from 'react'
import './styles/HomeCont.css'
import Navbar from '../components/Navbar'
import { Route, Switch } from 'react-router'
import Home from '../pages/Home'
import CoursePage from '../pages/CoursePage'

export default function HomeCont() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="app-window">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/courses/course/:courseID">
            <CoursePage />
          </Route>
        </Switch>
      </div>
    </div>
  )
}
