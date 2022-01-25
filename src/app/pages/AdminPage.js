import React, { useContext, useEffect } from 'react'
import { NavLink, Route, Switch } from "react-router-dom"
import './styles/AdminPage.css'
import AdminCourses from '../components/admin/AdminCourses'
import AdminInstructors from '../components/admin/AdminInstructors'
import { StoreContext } from '../store/store'
import AdminInstructorApplications from "../components/admin/AdminInstructorApplications"
import AdminEmails from "../components/admin/AdminEmails"

export default function AdminPage() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)

  const headerLinks = [
    {name: 'Courses', url: '/admin/', exact: true},
    {name: 'Instructors', url: '/admin/instructors'},
    {name: 'Applications', url: '/admin/instructor-applications'},
    {name: 'Emails', url: '/admin/emails'},
    {name: 'Theme', url: '/admin/theme'},
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
            <Route path="/admin/instructor-applications">
              <AdminInstructorApplications />
            </Route>
            <Route path="/admin/emails">
              <AdminEmails />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}
