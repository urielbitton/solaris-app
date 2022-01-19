import { db } from "../firebase/fire"
import { setSubDB } from "./CrudDB"

export const createNewNotification = (userID, title, text, url, icon='fal fa-bell') => {
  const newNotifID = db.collection('users')
  .doc(userID)
  .collection('notifications')
  .doc().id
  return setSubDB('users', userID, 'notifications', newNotifID, {
    dateAdded: new Date(),
    notifID: newNotifID,
    read: false,
    text,
    title,
    type: '',
    url,
    icon
  })
}