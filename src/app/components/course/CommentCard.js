import React, { useContext, useEffect, useState } from 'react'
import './styles/ReviewCard.css'
import Ratings from '../ui/Ratings'
import { convertFireDateToString } from '../../utils/utilities'
import {StoreContext} from '../../store/store'
import { db } from "../../firebase/fire"
import firebase from 'firebase'
import AppModal from '../ui/AppModal'
import { AppSelect, AppTextarea } from "../ui/AppInputs"
import { setDB } from "../../services/CrudDB"
import { isUserInstructor } from "../../services/userServices"
import { Link } from "react-router-dom"

export default function CommentCard(props) {

  const {user} = useContext(StoreContext)
  const {authorName, authorImg, dateAdded, rating, text,
    title, userID, commentID, likes} = props.comment
  const {type, courseID, lessonID, videoID} = props
  const [openReport, setOpenReport] = useState(false)
  const [reportMessage, setReportMessage] = useState('')
  const [reportReason, setReportReason] = useState('')
  const [isInstructor, setIsInstructor] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editText, setEditText] = useState(text)
  const docRef = db.collection('courses').doc(courseID)
    .collection('lessons').doc(lessonID)
    .collection('videos').doc(videoID)
    .collection('comments').doc(commentID)

  const reportReasons = [
    {name: 'Please choose a reason of report', value: ''},
    {name: 'Offensive Language', value: 'offensive-language'},
    {name: 'Racism or hate speech', value: 'racism-hate-speech'},
    {name: 'Innapropriate Comment', value: 'innappropriate'},
    {name: 'Other', value: 'other'}
  ]

  const likeComment = () => {
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

  const saveComment= () => {
    docRef.update({
      text: editText
    }).then(() => {
      setEditMode(false)
    })
    .catch(err => console.log(err))
  }
  const cancelSave = () => {
    setEditMode(false)
    setEditText(text)
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

  useEffect(() => {
    isUserInstructor(userID, setIsInstructor)
  },[user])
  

  return (
    <div className="review-card">
      <img src={authorImg} alt="" />
      <div className="review-body">
        <div className="titles">
        <h4>
            <Link to={isInstructor ? `/instructors/instructor/${userID}` : `/my-profile/${userID}`}>
              {authorName} 
              {isInstructor && <span className="instructor-badge">Instructor</span>}
            </Link>
          </h4>
          {user?.uid === userID ? <small onClick={() => setEditMode(true)}>Edit</small> : <></>}
        </div> 
        <h5>{convertFireDateToString(dateAdded)}</h5>
        { type === 'review' && 
          <>
            <Ratings rating={rating} />
            <q>{title}</q>
          </>
        }
        { !editMode ?
          <p className="review-text">{text}</p> :
          <>
            <AppTextarea onChange={(e) => setEditText(e.target.value)} value={editText} className="review-text-textarea" />
            <div className="edit-actions">
              <small onClick={() => saveComment()}>Save</small>
              <small onClick={() => cancelSave()}>Cancel</small>
            </div>
          </>
        }
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
