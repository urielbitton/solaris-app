import React, { useContext, useEffect } from 'react'
import { StoreContext } from '../../store/store'

export default function AccountSettings() {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)

  useEffect(() => {
    setNavTitle('Settings')
    setNavDescript('')
  },[])

  return (
    <div className="settings-page">
      Settings Tab
    </div>
  )
}
