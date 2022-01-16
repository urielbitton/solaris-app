import React, { useContext } from 'react'
import './styles/Account.css'
import { StoreContext } from '../../store/store'
import { NavLink, Route, Switch } from "react-router-dom"
import AccountSettings from "./AccountSettings"
import MyAccountContent from './MyAccountContent'

export default function AccountContent() {

  const { myUser } = useContext(StoreContext)
  const isUserInstructor = myUser?.isInstructor

  const headerLinks = [
    { name: 'My Account', url: '/my-account', access: true, exact: true },
    { name: 'My Settings', url: '/my-account/settings', access: true },
    { name: 'Courses', url: '/my-account/courses-settings', access: true },
    { name: 'Instructor', url: '/my-account/instructor-settings', access: isUserInstructor },
    { name: 'Notifications', url: '/my-account/notifications-settings', access: true },
    { name: 'Preferences', url: '/my-account/preferences', access: true },
    { name: 'Advanced', url: '/my-account/advanced-settings', access: true },
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
      <div className="data-container">
        <Switch>
          <Route path="/my-account">
            <MyAccountContent />
          </Route>
          <Route path="/my-account/settings">
            <AccountSettings />
          </Route>
        </Switch>
      </div>
    </div>
  )
}
