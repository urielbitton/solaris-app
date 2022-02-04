import React, { useContext, useEffect, useState } from 'react'
import './styles/CreateCertification.css'
import certificateImg from '../assets/imgs/certificate.png'
import badgeImg from '../assets/imgs/badge-img.png'
import { StoreContext } from "../store/store"
import { useRouteMatch } from "react-router-dom"
import { getInstructorByID } from "../services/InstructorServices"
import { Helmet } from 'react-helmet'
import { getCourseByID, getStudentEnrolledInCourseByCourseID } from '../services/courseServices'
import { AppInput, AppSelect, AppTextarea } from '../components/ui/AppInputs'
import { deleteSubDB, setSubDB } from '../services/CrudDB'
import { db } from "../firebase/fire"
import PageLoader from '../components/ui/PageLoader'
import { useLocation } from "react-router-dom"
import { getCertificationByIDAndUserID } from '../services/userServices'
import { useHistory } from "react-router-dom"
import { convertFireDateToInputDateFormat } from "../utils/utilities"

export default function CreateCertification() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)
  const studentID = useRouteMatch('/create-certification/:instructorID/:courseID/:studentID').params.studentID
  const instructorID = useRouteMatch('/create-certification/:instructorID/:courseID/:studentID').params.instructorID
  const courseID = useRouteMatch('/create-certification/:instructorID/:courseID/:studentID').params.courseID
  const [certificationID, setCertificationID] = useState('')
  const [certificationName, setCertificationName] = useState('Excellence')
  const [presentText, setPresentText] = useState('We proudly present this to')
  const [certificationNote, setCertificationNote] = useState('Add description here...')
  const [completionDate, setCompletionDate] = useState('')
  const [student, setStudent] = useState({})
  const [instructor, setInstructor] = useState({})
  const [course, setCourse] = useState({})
  const [loading, setLoading] = useState(false)
  const [certification, setCertification] = useState({})
  const history = useHistory()
  const location = useLocation()
  const allowCreate = certificationName?.length && presentText?.length && certificationNote?.length && completionDate
  const editMode = location.search.includes('edit=true')
 
  const presentTextOptions = [
    {name: 'We proudly present this to', value: 'We proudly present this to'},
    {name: 'We are proud to present this to', value: 'We are proud to present this to'},
    {name: 'We present in honor of their achievements, to', value: 'We present in honor of their achievements, to'},
  ]

  const createSaveCertificate = () => {
    if(allowCreate) {
      setLoading(true)
      const genCertificateID = db.collection('users').doc(studentID)
      .collection('certifications').doc().id
      setSubDB('users', studentID, 'certifications', !editMode ? genCertificateID : certificationID, {
        certificationID: !editMode ? genCertificateID : certificationID,
        courseID,
        courseName: course.title,
        dateCompleted: new Date(Date.parse(completionDate) + 18_000_000),
        instructorID,
        instructorName: instructor.name,
        name: certificationName,
        note: certificationNote,
        presentText,
        studentID,
        studentName: student.name
      }, true)
      .then(() => {
        setLoading(false)
        history.push(`/certification/${courseID}/${studentID}/${!editMode ? genCertificateID : certificationID}`)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
    }
  }

  const deleteCertification = () => {
    if(editMode) {
      const confirm = window.confirm('Are you sure you want to delete this certification?')
      if(confirm) {
        setLoading(true)
        deleteSubDB('users', studentID, 'certifications', certificationID)
        .then(() => {
          setLoading(false)
          history.push('/my-students')
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
      }
    }
  }

  useEffect(() => {
    getInstructorByID(instructorID, setInstructor)
    getStudentEnrolledInCourseByCourseID(courseID, studentID, setStudent)
    getCourseByID(courseID, setCourse)
    if(editMode) {
      setCertificationID(location.search.split('certificationID=')[1])
    }
  },[])
  
  useEffect(() => {
    if(editMode && certificationID.length) {
      getCertificationByIDAndUserID(certificationID, studentID, setCertification)
    }
  },[certificationID])

  useEffect(() => {
    if(editMode && certification) {
      setCertificationName(certification.name)
      setCertificationNote(certification.note)
      setPresentText(certification.presentText)
      setCompletionDate(convertFireDateToInputDateFormat(certification?.dateCompleted))
    }
  },[certification])

  useEffect(() => {
    setNavTitle(`${!editMode ? 'Create' : 'Edit'} Certificate`)
    setNavDescript('Instructor')
  },[])

  return (
    <div className="create-certification-page">
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Allura&display=swap" rel="stylesheet" />
      </Helmet>
      <div className="form-container">
        <div className="titles">
          <h3>Certification Details</h3>
          <h4><span>Course:</span> {course?.title}</h4>
          <h4><span>Instructor:</span> {instructor?.name}</h4>
          <h4><span>Student:</span> {student?.name}</h4>
        </div>
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
          value={certificationNote?.length > 99 ? certificationNote?.slice(0,99)+'...' : certificationNote}
        />
        <AppInput
          title="Completion Date"
          type="date"
          onChange={(e) => setCompletionDate(e.target.value)}
          value={completionDate}
        />
        <div className="btn-group">
          <button 
            className="shadow-hover"
            onClick={() => createSaveCertificate()}
            disabled={!allowCreate}
          >{!editMode ? 'Create' : 'Save'} Certificate</button>
          {
            editMode &&
            <button 
              className="delete-btn"
              onClick={() => deleteCertification()}
            >Delete Certificate</button>
          }
        </div>
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
      <PageLoader loading={loading} />
    </div>
  )
}
