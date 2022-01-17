import React, { useContext } from 'react'
import { StoreContext } from "../../store/store"
import { AppSwitch } from '../ui/AppInputs'

export default function AccountPreferences() {

  const { darkMode, setDarkMode } = useContext(StoreContext)

  return (
    <div>
      <section>
        <h4>Themes</h4>
        <AppSwitch 
          title="Dark Mode"
          onChange={(e) => setDarkMode(e.target.checked)}
          checked={darkMode}
        />
      </section>
      <section>
        <h4>App Preferences</h4>
      </section>
    </div>
  )
}
