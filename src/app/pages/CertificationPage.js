import React, { useContext, useEffect, useRef, useState } from 'react'
import { useRouteMatch } from "react-router-dom"
import './styles/CertificationPage.css'
import { StoreContext } from '../store/store'
import { getCertificationByIDAndUserID } from '../services/userServices'
import certificateImg from '../assets/imgs/certificate.png'
import badgeImg from '../assets/imgs/badge-img.png'
import html2canvas from 'html2canvas'
import { Helmet } from 'react-helmet'
import { useHistory } from "react-router-dom"
import { convertFireDateToString } from "../utils/utilities"

export default function CertificationPage() {

  const { setNavTitle, setNavDescript, myUser } = useContext(StoreContext)
  const studentID = useRouteMatch('/certification/:courseID/:studentID/:certificationID').params.studentID
  const courseID = useRouteMatch('/certification/:courseID/:studentID/:certificationID').params.courseID
  const certificationID = useRouteMatch('/certification/:courseID/:studentID/:certificationID').params.certificationID
  const [certification, setCertification] = useState({})
  const [renderedImg, setRenderedImg] = useState(null)
  const pageRef = useRef()
  const captureRef = useRef()
  const downloadableImgRef = useRef()
  const pageAccess = myUser?.userID === studentID || myUser?.instructorID === certification?.instructorID
  const isCertificateInstructor = myUser?.instructorID === certification?.instructorID
  const history = useHistory()

  const downloadCertification = () => {
    html2canvas(captureRef.current).then(canvas => {
      pageRef.current.appendChild(canvas)
      setRenderedImg(canvas.toDataURL("image/png"))
    })
  }

  useEffect(() => {
    getCertificationByIDAndUserID(certificationID, studentID, setCertification)
  },[studentID])

  useEffect(() => {
    if(renderedImg) {
      downloadableImgRef.current.click()
      setRenderedImg(null)
    }
  },[renderedImg])

  useEffect(() => {
    setNavTitle('Certification')
    setNavDescript(certification?.courseName)
  },[certification])

  return (
    pageAccess ?
    <div className="certification-page" ref={pageRef}>
      <Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Allura&display=swap" rel="stylesheet" />
      </Helmet>
      <header>
        <h3>{certification?.name}</h3>
        <h4>Student: {certification?.studentName}</h4>
        <h4>Course: {certification?.courseName}</h4>
        <h4>Date Issued: {convertFireDateToString(certification?.dateCompleted)}</h4>
      </header>
      <section>
        <div className="certification-container" ref={captureRef}>
          <img src={certificateImg} alt="certification"/>
          <div className="text-container">
            <h1>{certification?.name?.slice(0,11)}</h1>
            <h5>{certification?.name?.slice(11)}</h5>
            <h4>We proudly present this to</h4>
            <h2>{certification?.studentName}</h2>
            <p>{certification?.note}</p>
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
                <span>{certification?.instructorName}</span>
                <hr />
                <h6>Instructor</h6>
              </div>
            </footer>
          </div>
        </div>
        <small>Download certification at bottom of page.</small>
      </section>
      <footer>
        <button 
          className="shadow-hover"
          onClick={() => downloadCertification()}
        >Download Certificate</button>
        <button className="shadow-hover">Share on Linkedin</button>
        <a 
          href={renderedImg} 
          download
          style={{display:'none'}} 
          ref={downloadableImgRef}
        >Rendered Image</a>
        {
          isCertificateInstructor &&
          <button 
            className="shadow-hover"
            onClick={() => {
              history.push(`/create-certification/${certification?.instructorID}/${courseID}/${studentID}?edit=true&certificationID=${certificationID}`)
            }}
          >Edit Certification</button>
        } 
      </footer>
    </div> :
    <></>
  )
}
