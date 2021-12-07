import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import './styles/CreateCoursePage.css'
import {StoreContext} from '../store/store'
import { videoTypes } from '../api/apis'

export default function CreateCoursePage() {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)
  const courseType = useRouteMatch('/create/create-course/:courseType').params.courseType
  const [videoType, setVideoType] = useState('')

  const videoTypesRender = videoTypes?.map((type,i) => {
    return <div 
      className={`type-box ${videoType === type.value ? "active" : ""}`} 
      onClick={() => setVideoType(type.value)}
      key={i} 
    >
      <i className={`${type.icon} main-icon`}></i>
      <h4>{type.name}</h4>
      <i className="fas fa-check-circle check-icon"></i>
    </div>
  })

  useEffect(() => {
    setNavTitle('Create')
    setNavDescript(courseType + " course")
  },[courseType])

  return (
    <div className="create-course-page">
      <div className="create-content hidescroll">
        <h3>Create {courseType} Course</h3>
        <div className="video-type-container">
          <h5>Choose a video type</h5>
          {videoTypesRender}
        </div>
      </div>
      <div className="side-bar hidescroll">
        meta sidebar
      </div>
    </div>
  )
}
