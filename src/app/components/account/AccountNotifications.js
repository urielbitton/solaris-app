import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from "../../store/store"
import { AppSwitch } from "../ui/AppInputs"
import { getUserSettingsByUserAndDocID } from '../../services/userServices'
import { updateSubDB } from "../../services/CrudDB"

export default function AccountNotifications(props) {

  const { myUser } = useContext(StoreContext)
  const { setLoading } = props
  const [notificationSettings, setNotificationsSettings] = useState({})
  const [enableNotifications, setEnableNotifications] = useState(true)

  const saveSettings = () => {
    setLoading(true)
    updateSubDB('users', myUser?.userID, 'settings', 'notifications', {
      enableNotifications
    })
    .then(() => {
      setLoading(false)
    })
    .catch(error => {
      console.log(error)
      setLoading(false)
    })
  }

  useEffect(() => {
    getUserSettingsByUserAndDocID(myUser?.userID, 'notifications', setNotificationsSettings)
  },[myUser])

  useEffect(() => {
    setEnableNotifications(notificationSettings.enableNotifications)
  },[notificationSettings])

  return (
    <div>
      <section>
        <h4>General</h4>
        <AppSwitch 
          title="Enable App Notifications"
          onChange={(e) => setEnableNotifications(e.target.checked)}
          checked={enableNotifications}
        />
      </section>
      <footer>
        <button 
          className="shadow-hover"
          onClick={() => saveSettings()}
        >Save</button>
      </footer>
    </div>
  )
}
