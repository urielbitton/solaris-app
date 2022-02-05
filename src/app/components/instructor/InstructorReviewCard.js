import React, { useContext, useEffect, useState } from 'react'
import '../course/styles/ReviewCard.css'
import Ratings from '../ui/Ratings'
import { convertFireDateToString } from '../../utils/utilities'
import {StoreContext} from '../../store/store'
import { db } from "../../firebase/fire"
import { AppInput, AppTextarea } from "../ui/AppInputs"
import { isUserInstructor } from "../../services/userServices"
import { Link } from "react-router-dom"
import StarRate from "../ui/StarRate"
import { deleteSubDB, updateDB } from '../../services/CrudDB'
import firebase from 'firebase'

export default function InstructorReviewCard(props) {

  const { user } = useContext(StoreContext)
  const {authorName, authorImg, dateAdded, rating, text, title, userID, 
    reviewID } = props.review
  const { instructor } = props
  const [isInstructor, setIsInstructor] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editText, setEditText] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editRating, setEditRating] = useState(1)
  const docRef = db.collection('instructors')
    .doc(instructor?.instructorID)
    .collection('reviews')
    .doc(reviewID)

  const stars = [1,2,3,4,5]

  const starsRender = stars.map((number,i) => {
    return <StarRate 
      number={number} 
      rating={editRating}
      setRating={setEditRating}
      starNum={i+1}
      key={i} 
    />
  })

  const saveReview = () => {
    if(text.length && title.length) {
      let oldRating
      let newRating = editRating
      if(instructor?.reviewsCount > 1) {
        oldRating = ((instructor?.rating * instructor?.reviewsCount) - rating) / (instructor?.reviewsCount-1)
        newRating = ((oldRating * (instructor?.reviewsCount-1)) + editRating) / instructor?.reviewsCount
      }
      docRef.update({
        text: editText,
        title: editTitle,
        rating: +editRating
      }).then(() => {
        updateDB('instructors', instructor?.instructorID, {
          rating: +newRating
        })
        setEditMode(false)
      })
      .catch(err => console.log(err))
    }
  }

  const cancelSave = () => {
    setEditMode(false)
    setEditText(text)
    setEditTitle(title)
    setEditRating(rating)
  }

  const deleteReview = () => {
    const confirm = window.confirm('Are you sure you want to delete this review?')
    if(confirm) {
      let oldRating
      if(instructor?.reviewsCount > 1) {
        oldRating = ((instructor?.rating * instructor?.reviewsCount) - rating) / (instructor?.reviewsCount-1)
      }
      else {
        oldRating = 0
      }
      deleteSubDB('instructors', instructor?.instructorID, 'reviews', reviewID)
      .then(() => {
        updateDB('instructors', instructor?.instructorID, {
          rating: oldRating,
          reviewsCount: firebase.firestore.FieldValue.increment(-1)
        })
        .then(() => cancelSave())
        .catch(err => console.log(err)) 
      })
      .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    isUserInstructor(userID, setIsInstructor)
  },[user])

  useEffect(() => {
    if(editMode) {
      setEditRating(rating)
      setEditTitle(title)
      setEditText(text)
    }
  },[editMode])
  

  return (
    <div className="review-card">
      <img src={authorImg} alt="" />
      <div className="review-body">
        <div className="titles">
        <h4>
            <Link to={`/profile/${userID}`}>
              {authorName} 
              {isInstructor && <span className="instructor-badge">Instructor</span>}
            </Link>
          </h4>
          { user?.uid === userID ? <small onClick={() => setEditMode(true)}>Edit</small> : <></> }
        </div> 
        <h5>{convertFireDateToString(dateAdded)}</h5>
        <>
          {
            !editMode ? 
            <>
              <Ratings rating={rating} /> 
              <q>{title}</q>
            </> :
              <div className="rating-setter"> 
                {starsRender}
                <AppInput 
                  onChange={(e) => setEditRating(+e.target.value)} 
                  type="number" 
                  min={1} 
                  max={5} 
                  value={editRating < 5 ? editRating : 5} 
                  step={0.1}
                />
                <small>*Enter decimal values here.</small>
              </div>
            }
          </>
        { !editMode ?
          <p className="review-text">{text}</p> :
          <>
            <AppInput
              onChange={(e) => setEditTitle(e.target.value)} 
              value={editTitle}
            />    
            <AppTextarea 
              onChange={(e) => setEditText(e.target.value)} 
              value={editText} 
              className="review-text-textarea" 
            />
            <div className="edit-actions">
              <small onClick={() => saveReview()}>Save</small>
              <small onClick={() => cancelSave()}>Cancel</small>
              <small 
                onClick={() => deleteReview()}
                style={{color:'var(--red)'}}
              >Delete</small>
            </div>
          </>
        }
      </div>
    </div>
  )
}
