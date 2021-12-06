import React, { useContext, useEffect } from 'react'
import {StoreContext} from '../store/store'

export default function MyLibrary() {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)

  useEffect(() => {
    setNavTitle('My Library')
    setNavDescript('x courses in library')
  },[])

  return (
    <div className="my-library-page">
      
    </div>
  )
}
