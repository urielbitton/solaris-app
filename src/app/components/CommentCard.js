import React, { useContext } from 'react'
import './styles/ReviewCard.css'
import Ratings from './Ratings'
import { convertFireDateToString } from '../utils/utilities'
import {StoreContext} from '../store/store'

export default function CommentCard(props) {

  const {authorName, authorImg, dateAdded, rating, text,
    title, userID, likes} = props.comment
  const {type} = props
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
            <small className={likes?.includes(user?.uid) ? "active" : ""}>{likes?.includes(user?.uid) ? "Liked" : "Like"}</small>
            <small>Report</small>
          </div>
        }
      </div>
    </div>
  )
}
