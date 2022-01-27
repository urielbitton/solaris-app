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

  const resetSettings = () => {
    setLoading(true)
    updateDB('admin', 'generalSettings', {
      allowDarkMode: true,
      enableNotifications: true,
      colorTheme: '#2f86ff'
    }) 
    .then(() => {
      document.documentElement.style.setProperty('--lighterblue', '#6cbdf8')
      document.documentElement.style.setProperty('--lightestblue', 'rgb(211, 237, 255,0.4)')
      document.documentElement.style.setProperty('--blueShadow', '0 13px 15px 5px rgba(47, 81, 232, 0.12)')
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
        <button
          className="shadow-hover"
          onClick={() => resetSettings()}
        >Reset Settings</button>
      </div>
      <PageLoader loading={loading} />
    </div>
  )
}
