import React, { useContext, useEffect, useState } from 'react'
import './styles/ReviewCard.css'
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

export default function ReviewCard(props) {

  const { user } = useContext(StoreContext)
  const {authorName, authorImg, dateAdded, rating, text, title, userID, 
    reviewID } = props.review
  const { course } = props
  const [isInstructor, setIsInstructor] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editText, setEditText] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editRating, setEditRating] = useState(1)
  const docRef = db.collection('courses')
    .doc(course?.id)
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

  const cancelSave = () => {
    setEditMode(false)
    setEditText(text)
    setEditTitle(title)
    setEditRating(rating)
  }

  const saveReview = () => {
    if(text.length && title.length) {
      let oldRating
      let newRating = editRating
      if(course?.numberOfReviews > 1) {
        oldRating = ((course?.rating * course?.numberOfReviews) - rating) / (course?.numberOfReviews-1)
        newRating = ((oldRating * (course?.numberOfReviews-1)) + editRating) / course?.numberOfReviews
      }
      docRef.update({
        text: editText,
        title: editTitle,
        rating: +editRating
      }).then(() => {
        updateDB('courses', course?.id, {
          rating: +newRating
        })
        cancelSave()
      })
      .catch(err => console.log(err))
    }
  }

  const deleteReview = () => {
    const confirm = window.confirm('Are you sure you want to delete this review?')
    if(confirm) {
      let oldRating
      if(course?.numberOfReviews > 1) {
        oldRating = ((course?.rating * course?.numberOfReviews) - rating) / (course?.numberOfReviews-1)
      }
      else {
        oldRating = 0
      }
      deleteSubDB('courses', course?.id, 'reviews', reviewID)
      .then(() => {
        updateDB('courses', course?.id, {
          rating: oldRating,
          numberOfReviews: firebase.firestore.FieldValue.increment(-1)
        })
        .then(() => cancelSave())
        .catch(err => {
          console.log(err)
          cancelSave()
        }) 
      })
      .catch(err => {
        console.log(err)
        cancelSave()
      })
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
              <small 
                onClick={() => deleteReview()}
                style={{color:'var(--danger)'}}
              >Delete</small>
              <small onClick={() => cancelSave()}>Cancel</small>
            </div>
          </>
        }
      </div>
    </div>
  )
}
