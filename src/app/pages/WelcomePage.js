import React, { useEffect, useContext } from 'react'
import { StoreContext } from '../store/store'
import './styles/WelcomePage.css'
import welcomeImg from '../assets/imgs/welcome-img.png'
import welcomeBlob from '../assets/imgs/welcome-blob.svg'

export default function WelcomePage() {

  const { setWindowPadding, setNavTitle, setNavDescript } = useContext(StoreContext)

  useEffect(() => {
    setWindowPadding('60px 0 0 0')
    setNavTitle('Welcome to Solaris')
    setNavDescript('')
    return() => setWindowPadding("100px 30px 0px 30px")
  },[])

  return (
    <div className="welcome-page">
      <div className="banner">
        <div className="text-container">
          <h6>Welcome to Solaris</h6>
          <h1><span>Propel</span> Your Education</h1>
          <p>Students who have taken our courses have succeeded in all industries and have taken control over their skills and education.</p>
          <div className="btn-group">
            <button className="shadow-hover">Discover Courses</button>
            <button className="shadow-hover">Discover Instructors</button>
          </div>
        </div>
        <div className="img-container">
          <img 
            src={welcomeImg}
            className="welcome-img" 
            alt="welcome" 
          />
          <img 
            src={welcomeBlob} 
            className="blob"
            alt="blob" 
          />
        </div>
      </div>
    </div>
  )
}
