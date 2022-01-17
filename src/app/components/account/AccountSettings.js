import React, { useContext, useEffect } from 'react'
import { StoreContext } from '../../store/store'

export default function AccountSettings(props) {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)
  const { setLoading } = props

  useEffect(() => {
    setNavTitle('Settings')
    setNavDescript('')
  },[])

  return (
    <div className="settings-page">
      <section>
        <h4>General Settings</h4>
      </section>
    </div>
  )
}
