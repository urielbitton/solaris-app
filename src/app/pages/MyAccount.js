import React from 'react'
import AccountContent from "../components/account/AccountContent"
import AccountSidebar from "../components/account/AccountSidebar"
import './styles/MyAccount.css'

export default function MyAccount() {

  return (
    <div className="my-account-page">
      <div className="banner" />
      <div className="account-container">
        <AccountSidebar />
        <AccountContent />
      </div>
    </div>
  )
}
