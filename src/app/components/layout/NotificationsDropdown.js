import React, { useContext, useEffect, useState } from 'react'
import { getAllNotificationsByUserID } from "../../services/userServices"
import { StoreContext } from "../../store/store"
import './styles/NotificationsDropdown.css'
import { Link } from "react-router-dom"
import NotificationElement from "./NotificationElement"

export default function NotificationsDropdown(props) {

  const { user } = useContext(StoreContext)
  const { viewAll, setSlideNotifs, notifsLimit } = props
  const [allNotifs, setAllNotifs] = useState([])
  
  const allNotifsRender = allNotifs?.map((notif,i) => {
    return <NotificationElement notif={notif} key={i} />
  })

  useEffect(() => {
    getAllNotificationsByUserID(user?.uid, setAllNotifs, notifsLimit)
  },[user, notifsLimit])

  return (
    <>
      <header>
        <h4>Notifications</h4>
        { 
          viewAll ? 
          <small>
            <Link 
              to="/notifications" 
              onClick={() => setSlideNotifs(false)}
            >
              View All
            </Link>
          </small> : 
          ""
        }
      </header>
      <section className="hidescroll">
        {allNotifsRender}
      </section>
    </>
  )
}
