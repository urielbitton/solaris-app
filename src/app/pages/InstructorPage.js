import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import { getInstructorByID } from '../services/InstructorServices'
import './styles/InstructorPage.css'
import {StoreContext} from '../store/store'

export default function InstructorPage(props) {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)
  const {} = props
  const [instructor, setInstructor] = useState({})
  const instructorID = useRouteMatch('/instructors/instructor/:instructorID')?.params.instructorID

  useEffect(() => {
    getInstructorByID(instructorID, setInstructor)
    setNavTitle('Instructor')
  },[instructorID])

  useEffect(() => {
    setNavDescript(instructor.name)
  },[instructor])

  return (
    <div className="instructor-page">
      <div className="profile-row">
        <img src={instructor.profilePic} className="profile-pic" alt="" />
        <div className="instructor-info">
          <h1>{instructor.name}</h1>
          <h5>{instructor.title}</h5>
          <h4>Bio</h4>
          <p>{instructor.bio}</p>
        </div>
        <hr/>
      </div>
    </div>
  )
}
