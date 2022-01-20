import React, { useContext } from 'react'
import AppContainer from './app/containers/AppContainer'
import { StoreContext } from './app/store/store'
import SiteContainer from './site/containers/SiteContainer'
import AuthSwitch from "./app/auth/AuthSwitch"

export default function AppSwitcher() {

  const {user, accessApp} = useContext(StoreContext)

  return (
    accessApp ?
    user ?
    <AppContainer /> :
    <AuthSwitch /> :
    <SiteContainer />
  )
}
