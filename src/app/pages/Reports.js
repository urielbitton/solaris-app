import React, { useContext, useEffect } from 'react'
import {StoreContext} from '../store/store'

export default function Reports() {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)

  useEffect(() => {
    setNavTitle('Reports')
    setNavDescript('This Week\'s Report')
  },[])

  return (
    <div className="reports-page">
      <h3>Coming Soon...</h3>
    </div>
  )
}
