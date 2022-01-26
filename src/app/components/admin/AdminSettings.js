import React, { useEffect, useState } from 'react'
import { AppInput, AppSwitch } from '../ui/AppInputs'
import { getAdminGeneralSettings } from '../../services/adminServices'
import { updateDB } from '../../services/CrudDB'
import PageLoader from '../ui/PageLoader'

export default function AdminSettings() {

  const [settings, setSettings] = useState({})
  const [allowDarkMode, setAllowDarkMode] = useState(true)
  const [colorTheme, setColorTheme] = useState('#2f86ff')
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [loading, setLoading] = useState(false)

  const saveInfo = () => {
    setLoading(true)
    updateDB('admin', 'generalSettings', {
      allowDarkMode,
      enableNotifications,
      colorTheme
    })
    .then(() => {
      setLoading(false)
    })
    .catch(err => {
      console.log(err)
      setLoading(false)
    })
  }

  useEffect(() => {
    getAdminGeneralSettings(setSettings)
  },[])

  useEffect(() => {
    setAllowDarkMode(settings.allowDarkMode)
    setColorTheme(settings.colorTheme)
    setEnableNotifications(settings.enableNotifications)
  },[settings])

  return (
    <div className="admin-settings">
      <section>
        <h4>General</h4>
        <AppSwitch 
          title="Allow Dark Mode"
          onChange={(e) => setAllowDarkMode(e.target.checked)}
          checked={allowDarkMode}
        />
        <AppSwitch 
          title="Allow Notifications"
          onChange={(e) => setEnableNotifications(e.target.checked)}
          checked={enableNotifications}
        />
        <AppInput
          title="Color Theme"
          type="color"
          onChange={(e) => setColorTheme(e.target.value)}
          value={colorTheme}
          className="color-input"
        />
      </section>
      <div className="btn-group">
        <button
          className="shadow-hover"
          onClick={() => saveInfo()}
        >Save</button>
      </div>
      <PageLoader loading={loading} />
    </div>
  )
}
