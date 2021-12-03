import React, { useContext } from 'react'
import './styles/ReviewCard.css'
import Ratings from './Ratings'
import { convertFireDateToString } from '../utils/utilities'
import {StoreContext} from '../store/store'

export default function ReviewCard(props) {

  const {authorName, authorImg, dateAdded, rating, reviewText,
    reviewTitle, userID} = props.review
  const {user} = useContext(StoreContext)

  return (
    <div className="review-card">
      <img src={authorImg} alt="" />
      <div className="review-body">
        <div className="titles">
          <h4>{authorName}</h4>
          {user?.uid === userID ? <small>Edit</small> : <></>}
        </div>
        <h5>{convertFireDateToString(dateAdded)}</h5>
        <Ratings rating={rating} />
        <q>{reviewTitle}</q>
        <p className="review-text">{reviewText}</p>
      </div>
    </div>
  )
}
