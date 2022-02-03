import React, { useContext, useEffect, useState } from 'react'
import './styles/CreateCertification.css'
import certificateImg from '../assets/imgs/certificate.png'
import badgeImg from '../assets/imgs/badge-img.png'
import { StoreContext } from "../store/store"
import { useRouteMatch } from "react-router-dom"
import { getInstructorByID } from "../services/InstructorServices"
import { Helmet } from 'react-helmet'
import { getStudentEnrolledInCourseByCourseID } from '../services/courseServices'
import { AppInput, AppSelect, AppTextarea } from '../components/ui/AppInputs'

export default function CreateCertification() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)
  const studentID = useRouteMatch('/create-certification/:instructorID/:courseID/:studentID').params.studentID
  const instructorID = useRouteMatch('/create-certification/:instructorID/:courseID/:studentID').params.instructorID
  const courseID = useRouteMatch('/create-certification/:instructorID/:courseID/:studentID').params.courseID
  const [certificationName, setCertificationName] = useState('Excellence')
  const [certificationNote, setCertificationNote] = useState('Add description here...')
  const [presentText, setPresentText] = useState('We proudly present this to')
  const [student, setStudent] = useState({})
  const [instructor, setInstructor] = useState({})

  const presentTextOptions = [
    {name: 'We proudly present this to', value: 'We proudly present this to'},
    {name: 'We are proud to present this to', value: 'We are proud to present this to'},
    {name: 'We present this in honor of their achievements', value: 'We present this in honor of their achievements'},
  ]

  useEffect(() => {
    getInstructorByID(instructorID, setInstructor)
    getStudentEnrolledInCourseByCourseID(courseID, studentID, setStudent)
  },[])

  useEffect(() => {
    setNavTitle('Create Certificate')
    setNavDescript('Instructor')
  },[])

  return (
    <div className="create-certification-page">
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Allura&display=swap" rel="stylesheet" />
      </Helmet>
      <div className="form-container">
        <h3>Certification Details</h3>
        <AppInput 
          title="Certificate Title"
          onChange={(e) => setCertificationName(e.target.value)}
          value={certificationName}
        />
        <AppSelect 
          title="Presentation Text"
          options={presentTextOptions}
          onChange={(e) => setPresentText(e.target.value)}
          value={presentText}
          namebased
        />
        <AppTextarea
          title="Description"
          onChange={(e) => setCertificationNote(e.target.value)}
          value={certificationNote.length > 99 ? certificationNote.slice(0,99)+'...' : certificationNote}
        />
      </div>
      <div className="preview-container">
        <h3>Certification Preview</h3>
        <div className="certification-container">
          <img src={certificateImg} alt="certification"/>
          <div className="text-container">
            <h1>Certificate</h1>
            <h5>of {certificationName}</h5>
            <h4>{presentText}</h4>
            <h2>{student?.name}</h2>
            <p>{certificationNote}</p>
            <img 
              src={badgeImg} 
              alt="badge" 
              className="badge-img"
            />
            <footer>
              <div>
                <span>Solaris lms</span>
                <hr />
                <h6>Solaris Platform</h6>
              </div>
              <div>
                <span>{instructor?.name}</span>
                <hr />
                <h6>Instructor</h6>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
