import React, { useContext } from 'react'
import { truncateText } from "../../utils/utilities"
import TimeAgo from 'timeago-react'
import { useHistory } from "react-router-dom"
import { db } from "../../firebase/fire"
import { StoreContext } from "../../store/store"

export default function NotificationElement(props) {

  const { user } = useContext(StoreContext)
  const { notifID, title, text, dateAdded, url, read } = props.notif
  const history = useHistory()

  const onNotifClick = () => {
    history.push(url ?? "/")
    db.collection('users').doc(user?.uid)
    .collection('notifications').doc(notifID).update({
      read: true
    })
  }

  return (
    <div className="notif-element" onClick={() => onNotifClick()}>
      <div className="notif-avatar">
        <i className="fal fa-bell"></i>
      </div>
      <div className="text-info">
        <div className="titles">
          <h5>{title}</h5>
          <div className={`read-reciept ${read ? "read" : ""}`} />
        </div>
        <p>{truncateText(text, 94)}</p>
        <small>
          <TimeAgo
            datetime={dateAdded?.toDate()}
            locale='en-CA'
          />
          </small>
      </div>
    </div>
  )
}
