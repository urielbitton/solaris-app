import React, { useContext, useEffect, useRef, useState } from 'react'
import { useRouteMatch } from "react-router-dom"
import './styles/CertificationPage.css'
import { StoreContext } from '../store/store'
import { getCertificationByIDAndUserID } from '../services/userServices'
import certificateImg from '../assets/imgs/certificate.png'
import badgeImg from '../assets/imgs/badge-img.png'
import solarisSignature from '../assets/imgs/solaris-signature.png'
import html2canvas from 'html2canvas'

export default function CertificationPage() {

  const { setNavTitle, setNavDescript, myUser } = useContext(StoreContext)
  const studentID = useRouteMatch('/certification/:courseID/:studentID/:certificationID').params.studentID
  const certificationID = useRouteMatch('/certification/:courseID/:studentID/:certificationID').params.certificationID
  const [certification, setCertification] = useState({})
  const [renderedImg, setRenderedImg] = useState(null)
  const pageRef = useRef()
  const captureRef = useRef()
  const downloadableImgRef = useRef()
  const pageAccess = myUser?.userID === studentID || myUser?.instructorID === certification?.instructorID

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
      <header>
        <h3>{certification?.name}</h3>
        <h4>Student: {certification?.studentName}</h4>
        <h4>Course: {certification?.courseName}</h4>
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
            <footer>
              <img 
                src={badgeImg} 
                alt="badge" 
                className="badge-img"
              />
              <img 
                src={solarisSignature} 
                alt="signature" 
                className="signature"
              />
              <hr />
              <h6>Solaris Platform</h6>
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
      </footer>
    </div> :
    <></>
  )
}
