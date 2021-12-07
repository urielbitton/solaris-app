import React, { useContext } from 'react'
import { StoreContext } from '../../app/store/store'

export default function Homepage() {

  const {setAccessApp} = useContext(StoreContext)

  return (
    <div>
      <h1>Solaris Homepage</h1>
      <button onClick={() => setAccessApp(true)}>Login to App</button>
    </div>
  )
}
