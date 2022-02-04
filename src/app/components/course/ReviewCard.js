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

export default function ReviewCard(props) {

  const { user } = useContext(StoreContext)
  const {authorName, authorImg, dateAdded, rating, text, title, userID, 
    reviewID } = props.review
  const { courseID } = props
  const [isInstructor, setIsInstructor] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editText, setEditText] = useState(text)
  const [editTitle, setEditTitle] = useState(title)
  const [editRating, setEditRating] = useState(0)
  const docRef = db.collection('courses')
    .doc(courseID)
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
    docRef.update({
      text: editText,
      title: editTitle,
      rating: editRating
    }).then(() => {
      setEditMode(false)
    })
    .catch(err => console.log(err))
  }
  const cancelSave = () => {
    setEditMode(false)
    setEditText(text)
  }

  useEffect(() => {
    isUserInstructor(userID, setIsInstructor)
  },[user])

  useEffect(() => {
    setEditRating(rating)
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
          {user?.uid === userID ? <small onClick={() => setEditMode(true)}>Edit</small> : <></>}
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
                  onChange={(e) => setEditRating(e.target.value)} 
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
            </div>
          </>
        }
      </div>
    </div>
  )
}
