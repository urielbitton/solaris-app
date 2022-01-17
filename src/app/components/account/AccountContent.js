import React, { useContext, useState } from 'react'
import './styles/Account.css'
import { StoreContext } from '../../store/store'
import { NavLink, Redirect, Route, Switch } from "react-router-dom"
import AccountSettings from "./AccountSettings"
import MyAccountHome from './MyAccountHome'
import AccountCourse from './AccountCourse'
import AccountInstructor from './AccountInstructor'
import AccountNotifications from './AccountNotifications'
import AccountPreferences from './AccountPreferences'
import PageLoader from '../ui/PageLoader'

export default function AccountContent() {

  const { myUser } = useContext(StoreContext)
  const [loading, setLoading] = useState(false)
  const isAdmin = myUser?.isAdmin

  const headerLinks = [
    { name: 'My Account', url: '/my-account', exact: true, access: true },
    { name: 'My Settings', url: '/my-account/settings', access: true },
    { name: 'Courses', url: '/my-account/course-settings', access: isAdmin },
    { name: 'Instructor', url: '/my-account/instructor-settings', access: isAdmin },
    { name: 'Notifications', url: '/my-account/notifications-settings', access: true },
    { name: 'Preferences', url: '/my-account/preferences-settings', access: true }
  ]

  const headerLinksRender = headerLinks
  ?.filter(link => link.access)
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

  return (
    <div className="account-content">
      <header>
        {headerLinksRender}
      </header>
      <div className="account-container">
        <Switch>
          <Route exact path="/my-account">
            <MyAccountHome setLoading={setLoading} />
          </Route>
          <Route path="/my-account/settings">
            <AccountSettings setLoading={setLoading} />
          </Route>
          <Route path="/my-account/course-settings">
            <AccountCourse setLoading={setLoading} />
          </Route>
          <Route path="/my-account/instructor-settings">
            <AccountInstructor setLoading={setLoading} />
          </Route>
          <Route path="/my-account/notifications-settings">
            <AccountNotifications setLoading={setLoading} />
          </Route>
          <Route path="/my-account/preferences-settings">
            <AccountPreferences setLoading={setLoading} />
          </Route>
          <Route>
            <Redirect to="/my-account/"/>
          </Route>
        </Switch>
      </div>
      <PageLoader loading={loading} />
    </div>
  )
}
