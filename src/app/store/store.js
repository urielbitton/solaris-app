import React, { createContext, useEffect, useState } from 'react'
import firebase from 'firebase'
import { db } from '../firebase/fire'

export const StoreContext = createContext()

 
const StoreContextProvider = (props) => {

  const user = firebase.auth().currentUser
  const [accessApp, setAccessApp] = useState(true)
  const [myUser, setMyUser] = useState({})
  const [aUser, setAUser] = useState({})
  const [navTitle, setNavTitle] = useState('Home')
  const [navDescript, setNavDescript] = useState('')
  const [loggingAuth, setLoggingAuth] = useState(true)

  useEffect(() => {
    if(user) {
      db.collection('users').doc(user.uid).onSnapshot(snap => {
        setMyUser(snap.data()) 
      })
    }
  },[user])

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => user?setAUser(user):setAUser({}))
  },[])

  return <StoreContext.Provider value={{ 
    accessApp, setAccessApp,
    user, myUser, setMyUser, aUser, setAUser, navTitle, setNavTitle, navDescript, setNavDescript,
    loggingAuth, setLoggingAuth
  }}>
    {props.children}
  </StoreContext.Provider>
}
export default StoreContextProvider