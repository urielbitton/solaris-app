import React, { useContext, useState } from 'react'
import './styles/ReviewCard.css'
import Ratings from './Ratings'
import { convertFireDateToString } from '../utils/utilities'
import {StoreContext} from '../store/store'
import { db } from "../firebase/fire"
import firebase from 'firebase'
import AppModal from './AppModal'
import { AppSelect, AppTextarea } from "./AppInputs"
import { setDB } from "../services/CrudDB"

export default function CommentCard(props) {

  const {user} = useContext(StoreContext)
  const {authorName, authorImg, dateAdded, rating, text,
    title, userID, commentID, likes} = props.comment
  const {type, courseID, lessonID, videoID} = props
  const [openReport, setOpenReport] = useState(false)
  const [reportMessage, setReportMessage] = useState('')
  const [reportReason, setReportReason] = useState('')

  const reportReasons = [
    {name: 'Please choose a reason of report', value: ''},
    {name: 'Offensive Language', value: 'offensive-language'},
    {name: 'Racism or hate speech', value: 'racism-hate-speech'},
    {name: 'Innapropriate Comment', value: 'innappropriate'},
    {name: 'Other', value: 'other'}
  ]

  const likeComment = () => {
    const docRef = db.collection('courses').doc(courseID)
    .collection('lessons').doc(lessonID)
    .collection('videos').doc(videoID)
    .collection('comments').doc(commentID)
    if(!likes?.includes(user?.uid)) {
      docRef.update({
        likes: firebase.firestore.FieldValue.arrayUnion(user?.uid)
      })
    }
    else {
      docRef.update({
        likes: firebase.firestore.FieldValue.arrayRemove(user?.uid)
      })
    }
  }

  const sendReport = () => {
    if(reportMessage.length && reportReason.length) {
      const newIncidentID = db.collection('incidents').doc().id
      setDB('incidents', newIncidentID, {
        commentID,
        dateAdded: new Date(),
        incidentID: newIncidentID,
        incidentType: 'comment',
        reason: reportReason,
        reporterID: user?.uid,
        text: reportMessage
      }).then(() => {
        setOpenReport(false)
        setReportMessage('')
        setReportReason('')
        window.alert('Your report has been sent. Our team will analyze the incident and get back to you shortly.')
      })
      .catch(err => console.log(err))
    }
  }

  return (
    <div className="review-card">
      <img src={authorImg} alt="" />
      <div className="review-body">
        <div className="titles">
          <h4>{authorName}</h4>
          {user?.uid === userID ? <small>Edit</small> : <></>}
        </div>
        <h5>{convertFireDateToString(dateAdded)}</h5>
        { type === 'review' && 
          <>
            <Ratings rating={rating} />
            <q>{title}</q>
          </>
        }
        <p className="review-text">{text}</p>
        {
          type === 'comment' &&
          <div className="interact-row">
            <small className={likes?.includes(user?.uid) ? "active" : ""} onClick={() => likeComment()}>
              {likes?.includes(user?.uid) ? "Liked" : "Like"}
            </small>
            <small onClick={() => setOpenReport(true)}>Report</small>
          </div>
        }
      </div>
      <AppModal
        title="Report Comment"
        showModal={openReport}
        setShowModal={setOpenReport}
        actions={<button className="shadow-hover" onClick={() => sendReport()}>Send Report</button>}
      >
        <form onSubmit={(e) => {e.preventDefault();sendReport()}}>
          <AppTextarea 
            placeholder="Report Message" 
            onChange={(e) => setReportMessage(e.target.value)} 
            value={reportMessage} 
          />
          <AppSelect 
            options={reportReasons} 
            onChange={(e) => setReportReason(e.target.value)} 
            value={reportReason} 
          />
        </form>
      </AppModal>
    </div>
  )
}
