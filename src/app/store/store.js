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

  useEffect(() => {
    if(user) {
      db.collection('users').doc(user.uid).onSnapshot(snap => {
        setMyUser(snap.data()) 
      })
    }
    firebase.auth().onAuthStateChanged(user => user?setAUser(user):setAUser({}))
  },[user])

  return <StoreContext.Provider value={{ 
    accessApp, setAccessApp,
    user, myUser, setMyUser, aUser, setAUser, navTitle, setNavTitle, navDescript, setNavDescript,
    loggingAuth, setLoggingAuth, windowPadding, setWindowPadding, openSidebar, setOpenSidebar,
    appBg, setAppBg
  }}>
    {children}
  </StoreContext.Provider>
}
export default StoreContextProvider