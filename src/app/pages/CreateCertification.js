import React, { useContext, useEffect, useState } from 'react'
import certificateImg from '../assets/imgs/certificate.png'
import badgeImg from '../assets/imgs/badge-img.png'
import solarisSignature from '../assets/imgs/solaris-signature.png'
import { StoreContext } from "../store/store"
import { useRouteMatch } from "react-router-dom"

export default function CreateCertification() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)
  const studentID = useRouteMatch('/create-certification/:instructorID/:courseID/:studentID/:certificationID').params.studentID
  const certificationID = useRouteMatch('/create-certification/:instructorID/:courseID/:studentID/:certificationID').params.certificationID
  const [certificationName, setCertificationName] = useState('')
  const [certificationNote, setCertificationNote] = useState('')
  const [presentText, setPresentText] = useState('')
  const [student, setStudent] = useState({})

  const presentTextOptions = [
    {name: 'We proudly present this to', value: 'We proudly present this to'},
    {name: 'We are proud to present this to', value: 'We are proud to present this to'},
    {name: 'We present this in honor of their achievements', value: 'We present this in honor of their achievements'},
  ]

  useEffect(() => {
    
  },[])

  return (
    <div className="create-certification-page">
      <div className="form-container">

      </div>
      <div className="preview-container">
        <div className="certification-container">
          <img src={certificateImg} alt="certification"/>
          <div className="text-container">
            <h1>Certificate</h1>
            <h5>of {certificationName}</h5>
            <h4></h4>
            <h2>{student?.name}</h2>
            <p>{certificationNote}</p>
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
      </div>
    </div>
  )
}
