import React, { useContext, useEffect } from 'react'
import AppContainer from '../containers/AppContainer';
import Login from './Login';
import Register from './Register'
import { StoreContext } from '../store/store';
import { useLocation } from 'react-router';

export default function AuthGate() {

  const {user, setMyUser, loggingAuth, setLoggingAuth} = useContext(StoreContext)
  const location = useLocation()

  useEffect(() => {
    if(!user) {
      setMyUser({})
    }
  },[user])

  useEffect(() => {
    if(location.pathname.includes('/register')) {
      setLoggingAuth(false)
    }
  },[location])

  return (
    user ? 
    <AppContainer /> : 
    loggingAuth ?
    <Login /> :
    <Register />
  )
}