import React, { useContext, useEffect } from 'react'
import Login from './Login';
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import { StoreContext } from '../store/store';
import { useLocation } from 'react-router';
import { Switch, Route } from "react-router-dom";

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
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/forgot-password">
        <ForgotPassword />
      </Route>
      <Route exact path="*" component={Login} />
    </Switch>
  )
}