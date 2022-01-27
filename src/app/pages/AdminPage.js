import React, { useContext, useEffect } from 'react'
import { NavLink, Route, Switch } from "react-router-dom"
import './styles/AdminPage.css'
import AdminCourses from '../components/admin/AdminCourses'
import AdminInstructors from '../components/admin/AdminInstructors'
import { StoreContext } from '../store/store'
import AdminInstructorApplications from "../components/admin/AdminInstructorApplications"
import AdminEmails from "../components/admin/AdminEmails"
import AdminSettings from "../components/admin/AdminSettings"
import AdminIncidents from "../components/admin/AdminIncidents"
import AdminStudents from "../components/admin/AdminStudents"

export default function AdminPage() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)

  const headerLinks = [
    {name: 'Courses', url: '/admin/', exact: true},
    {name: 'Instructors', url: '/admin/instructors'},
    {name: 'Students', url: '/admin/students'},
    {name: 'Applications', url: '/admin/instructor-applications'},
    {name: 'Emails', url: '/admin/emails'},
    {name: 'Incidents', url: '/admin/incidents'},
    {name: 'Settings', url: '/admin/settings'},
  ]

  const headerLinksRender = headerLinks
  .map((link, i) => {
    return <h5>
      <NavLink 
        exact={link.exact}
        to={link.url} 
        activeClassName="active-link"
      >
        {link.name}
      </NavLink>
    </h5>
  })

  useEffect(() => {
    setNavTitle('Admin')
    setNavDescript('Manage Admin app settings')
  },[])

  return (
    <div className="admin-page">
      <div className="admin-container">
        <header>
          {headerLinksRender}
        </header>
        <div className="admin-content">
          <Switch>
            <Route exact path="/admin/">
              <AdminCourses />
            </Route>
            <Route path="/admin/instructors">
              <AdminInstructors />
            </Route>
            <Route path="/admin/students">
              <AdminStudents />
            </Route>
            <Route path="/admin/instructor-applications">
              <AdminInstructorApplications />
            </Route>
            <Route path="/admin/emails">
              <AdminEmails />
            </Route>
            <Route path="/admin/incidents">
              <AdminIncidents />
            </Route>
            <Route path="/admin/settings">
              <AdminSettings />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}
