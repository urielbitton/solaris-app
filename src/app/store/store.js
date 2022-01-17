import React, { createContext, useEffect, useState } from 'react'
import firebase from 'firebase'
import { db } from '../firebase/fire'

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

  return <StoreContext.Provider value={{ 
    user, myUser, setMyUser, aUser, setAUser, 
    loggingAuth, setLoggingAuth, 
    accessApp, setAccessApp,
    navTitle, setNavTitle, navDescript, setNavDescript,
    windowPadding, setWindowPadding, appBg, setAppBg, 
    openSidebar, setOpenSidebar,
    darkMode, setDarkMode
  }}>
    {children}
  </StoreContext.Provider>
}
export default StoreContextProvider