import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../store/store'
import NotificationsDropdown from '../components/layout/NotificationsDropdown'
import './styles/NotificationsPage.css'

export default function NotificationsPage() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)
  const [notifsLimit, setNotifsLimit] = useState(20)
  
  useEffect(() => {
    setNavTitle('Notifications')
    setNavDescript('')
  },[])

  useEffect(() => {
    setNotifsLimit(20)
    return() => setNotifsLimit(7)
  },[])

  return (
    <div className="notifications-page">
      <NotificationsDropdown 
        notifsLimit={notifsLimit} 
      />
    </div>
  )
}
