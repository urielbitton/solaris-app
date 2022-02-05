import React, { useContext, useState } from 'react'
import StarRate from '../ui/StarRate'
import '../course/styles/WriteComment.css'
import { AppInput, AppTextarea } from '../ui/AppInputs'
import { StoreContext } from '../../store/store'
import { setSubDB, updateDB } from '../../services/CrudDB'
import { db } from '../../firebase/fire' 
import { createNewNotification } from '../../services/notificationsServices'
import firebase from 'firebase'

export default function WriteComment(props) {

  const { myUser } = useContext(StoreContext)
  const { instructor, instructorID } = props
  const [rating, setRating] = useState(1)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')

  const stars = [1,2,3,4,5]

  const starsRender = stars.map((number,i) => {
    return <StarRate 
      number={number} 
      rating={rating}
      setRating={setRating}
      starNum={i+1}
      key={i} 
    />
  })

  const writeReview = () => {
    if(title.length && text.length) {
      const newReviewID = db.collection('instructors')
        .doc(instructorID)
        .collection('reviews')
        .doc().id
      setSubDB('instructors', instructorID, 'reviews', newReviewID, {
        authorImg: myUser?.photoURL ?? "https://i.imgur.com/D4fLSKa.png",
        authorName: `${myUser?.firstName} ${myUser?.lastName}`,
        dateAdded: new Date(),
        rating: +rating,
        title,
        text,
        userID: myUser?.userID,
        reviewID: newReviewID
      })
      .then(() => {
        updateDB('instructors', instructorID, {
          reviewsCount: firebase.firestore.FieldValue.increment(1),
          rating: ((instructor?.rating * instructor?.reviewsCount) + rating) / (instructor?.reviewsCount + 1)
        })
        setTitle('')
        setText('')
        setRating(1)
        window.alert('Your review has been submitted.')
        createNewNotification(
          instructor?.instructorUserID,
          'New Review', 
          `${myUser?.firstName} ${myUser?.lastName} left a review on your instructor page.'`,
          `/instructors/instructor/${instructor?.instructorID}`,
          'fal fa-comment-alt'
        )
      })
      .catch(err => {
        console.log(err)
        window.alert('There was an error while trying to submit your review. Please try again later.')
      })
    }
  }

  return (
    <div className="add-comment-container">
      <h3>Add a Review</h3>
      <div className="rating-setter"> 
        {starsRender}
        <AppInput 
          onChange={(e) => setRating(+e.target.value)} 
          type="number" 
          min={1} 
          max={5} 
          value={rating < 5 ? rating : 5} 
          step={0.1}
        />
        <small>*Enter decimal values here.</small>
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <AppInput 
          placeholder="Review Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <AppTextarea 
          placeholder="Review Text" 
          onChange={(e) => setText(e.target.value)}
          value={text}
        /> 
        <button onClick={() => writeReview()}>Submit Review</button>
      </form>
    </div>
  )
}
