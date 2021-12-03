import React, { useContext, useState } from 'react'
import StarRate from './StarRate'
import './styles/WriteReview.css'
import { AppInput, AppTextarea } from './AppInputs'
import { StoreContext } from '../store/store'
import { setSubDB } from '../services/CrudDB'
import { db } from '../firebase/fire' 

export default function WriteReview({courseID}) {

  const {user} = useContext(StoreContext)
  const [rating, setRating] = useState(1)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewText, setReviewText] = useState('')

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

  const handleSubmit = () => {
    const newReviewID = db.collection('courses').doc(courseID).collection('reviews').doc().id
    const reviewObj = {
      authorImg: user?.photoURL ?? "https://i.imgur.com/D4fLSKa.png",
      authorName: user?.displayName ?? "Guest User",
      dateAdded: new Date(),
      rating,
      reviewTitle,
      reviewText,
      userID: user?.uid ?? "na"
    }
    if(reviewTitle.length && reviewText.length) {
      setSubDB('courses', courseID, 'reviews', newReviewID, reviewObj)
      .then(res => {
        setReviewTitle('')
        setReviewText('')
        window.alert('Your review has been submitted.')
      })
      .catch(err => {
        console.log(err)
        window.alert('There was an error while trying to submit your review. Please try again later.')
      })
    }
  }

  return (
    <div className="add-review-container">
      <h3>Write A Review</h3>
      <div className="rating-setter"> 
        {starsRender}
        <AppInput 
          onChange={(e) => setRating(e.target.value)} 
          type="number" 
          min={1} 
          max={5} 
          value={rating < 5 ? rating : 5} 
          step={0.5}
        />
        <small>*You can enter decimal values in the input field.</small>
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <AppInput 
          placeholder="Review Title"
          onChange={(e) => setReviewTitle(e.target.value)}
          value={reviewTitle}
        />
        <AppTextarea 
          placeholder="Review Summary"  
          onChange={(e) => setReviewText(e.target.value)}
          value={reviewText}
        /> 
        <button onClick={handleSubmit}>Submit Review</button>
      </form>
    </div>
  )
}
