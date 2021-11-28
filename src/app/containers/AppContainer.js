import React from 'react'
import { Switch } from 'react-router'
import HomeCont from './HomeCont'
import Sidebar from './Sidebar'
import './styles/AppContainer.css'

export default function AppContainer() {
  return (
    <div className="app-container">
      <Switch>
        <Sidebar />
        <HomeCont />
      </Switch>
    </div>
  )
}
