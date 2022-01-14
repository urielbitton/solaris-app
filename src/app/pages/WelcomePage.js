import React, { useEffect, useContext } from 'react'
import { StoreContext } from '../store/store'
import './styles/WelcomePage.css'
import welcomeImg from '../assets/imgs/welcome-img.png'
import welcomeBlob from '../assets/imgs/welcome-blob.svg'
import { useHistory } from "react-router-dom"
import { discoverCourses } from '../api/apis'
import DiscoverCard from "../components/ui/DiscoverCard"
import welcomeFoot from '../assets/imgs/welcome-foot.png'

export default function WelcomePage() {

  const { setAppBg, setNavTitle, setNavDescript } = useContext(StoreContext)
  const history = useHistory()

  const discoverRender = discoverCourses?.map((card, i) => {
    return <DiscoverCard 
      card={card}
      key={i}
    />
  })

  useEffect(() => {
    setAppBg('linear-gradient(0deg, rgba(252,253,253,1) 0%, rgba(231,237,240,1) 100%)')
    setNavTitle('Welcome to Solaris')
    setNavDescript('')
    return() => setAppBg('none')
  },[])

  return (
    <div className="welcome-page">
      <div className="banner">
        <div className="text-container">
          <h6>Welcome to Solaris</h6>
          <h1><span>Propel</span> Your Education</h1>
          <p>Students who have taken our courses have succeeded in all industries and have taken control over their skills and education.</p>
          <div className="btn-group">
            <button 
              className="shadow-hover"
              onClick={() => history.push('/courses')}
              >
                Discover Courses
            </button>
            <button 
              className="shadow-hover"
              onClick={() => history.push('/instructors')}
            >
              Discover Instructors
            </button>
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
      <section className="discover">
        <h4>Discover Courses</h4>
        <div className="discover-flex">
          {discoverRender}
        </div>
      </section>
      <footer>
        <img src={welcomeFoot} alt="welcome" />
        <h2>Get Started Now</h2>
        <p>We are glad to have you on board! So what are you waiting for, get started right away.</p>
        <button
          className="shadow-hover"
          onClick={() => history.push('/courses')}
        >
          View Courses
        </button>
      </footer>
    </div>
  )
}
