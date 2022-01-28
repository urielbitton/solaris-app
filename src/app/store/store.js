import React, { createContext, useEffect, useState } from 'react'
import firebase from 'firebase'
import { db } from '../firebase/fire'
import { getAdminGeneralSettings } from "../services/adminServices"

export const StoreContext = createContext()

const StoreContextProvider = ({children}) => {

  const user = firebase.auth().currentUser
  const [accessApp, setAccessApp] = useState(true)
  const [myUser, setMyUser] = useState({})
  const [aUser, setAUser] = useState({})
  const [navTitle, setNavTitle] = useState('Home')
  const [navDescript, setNavDescript] = useState('')
  const [loggingAuth, setLoggingAuth] = useState(true)
  const [windowPadding, setWindowPadding] = useState("100px 30px 0px 30px")
  const [appBg, setAppBg] = useState('')
  const [openSidebar, setOpenSidebar] = useState(false)
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkmode') === "true" ? true : false)
  const [adminSettings, setAdminSettings] = useState({})

  const currencyFormat = new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD'})
  const percentFormat = new Intl.NumberFormat('en-CA', {style: 'percent'})

  const adminUserID = 'tnHjCJ22kpM06xQtiVm0dPIKjL62'

  useEffect(() => {
    if(user) {
      db.collection('users').doc(user.uid).onSnapshot(snap => {
        setMyUser(snap.data()) 
      })
    }
    firebase.auth().onAuthStateChanged(user => user?setAUser(user):setAUser({}))
  },[user])

  useEffect(() => {
    localStorage.setItem('darkmode', !darkMode ? "false" : "true")  
  },[darkMode])  

  useEffect(() => {
    getAdminGeneralSettings(setAdminSettings)
  },[]) 

  useEffect(() => {
    document.documentElement.style.setProperty('--color', adminSettings.colorTheme)
    document.documentElement.style.setProperty('--lighterblue', adminSettings.colorTheme+'77')
    document.documentElement.style.setProperty('--lightestblue', adminSettings.colorTheme+'22')
    document.documentElement.style.setProperty('--blueShadow', `0 13px 15px 5px ${adminSettings.colorTheme}15`)
  },[adminSettings.colorTheme])

  return <StoreContext.Provider value={{ 
    user, myUser, setMyUser, aUser, setAUser, 
    loggingAuth, setLoggingAuth, 
    accessApp, setAccessApp,
    navTitle, setNavTitle, navDescript, setNavDescript,
    windowPadding, setWindowPadding, appBg, setAppBg, 
    openSidebar, setOpenSidebar,
    darkMode, setDarkMode,
    currencyFormat, percentFormat,
    adminUserID
  }}>
    {children}
  </StoreContext.Provider>
}
export default StoreContextProvider