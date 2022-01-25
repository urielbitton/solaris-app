import React, { useContext, useEffect } from 'react'
import Login from './Login';
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import { StoreContext } from '../store/store';
import { useLocation } from 'react-router';
import { Switch, Route } from "react-router-dom";
import ResetPassword from "./ResetPassword";

export default function AuthSwitch() {

  const {user, setMyUser, setLoggingAuth} = useContext(StoreContext)
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
      <Route path="/reset-password">
        <ResetPassword />
      </Route>
      <Route exact path="*" component={Login} />
    </Switch>
  )
}