import React from 'react'
import HomeCont from './HomeCont'
import Sidebar from '../components/Sidebar'
import './styles/AppContainer.css'

export default function AppContainer() {
  return (
    <div className="app-container">
      <Sidebar />
      <HomeCont />
    </div>
  )
}
