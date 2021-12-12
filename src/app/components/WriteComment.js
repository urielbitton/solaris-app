import React, { useContext, useState } from 'react'
import StarRate from './StarRate'
import './styles/WriteComment.css'
import { AppInput, AppTextarea } from './AppInputs'
import { StoreContext } from '../store/store'
import { setSubDB } from '../services/CrudDB'
import { db } from '../firebase/fire' 

export default function WriteComment(props) {

  const {user} = useContext(StoreContext)
  const {courseID, writeType, mainTitle, titleInput, messageInput} = props
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
    const newReviewID = db.collection('courses').doc(courseID).collection('reviews').doc().id
    const reviewObj = {
      authorImg: user?.photoURL ?? "https://i.imgur.com/D4fLSKa.png",
      authorName: user?.displayName ?? "Guest User",
      dateAdded: new Date(),
      rating,
      title,
      text,
      userID: user?.uid ?? "na"
    }
    if(title.length && text.length) {
      setSubDB('courses', courseID, 'reviews', newReviewID, reviewObj)
      .then(res => {
        setTitle('')
        setText('')
        setRating(1)
        window.alert('Your review has been submitted.')
      })
      .catch(err => {
        console.log(err)
        window.alert('There was an error while trying to submit your review. Please try again later.')
      })
    }
  }

  const writeComment = () => {
    
  }

  return (
    <div className="add-comment-container">
      <h3>{mainTitle}</h3>
      { writeType === 'review' &&
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
          <small>*Enter decimal values here.</small>
        </div>
      }
      <form onSubmit={(e) => e.preventDefault()}>
        { writeType === 'review' &&
          <AppInput 
            placeholder={titleInput}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        }
        <AppTextarea 
          placeholder={messageInput}  
          onChange={(e) => setText(e.target.value)}
          value={text}
        /> 
        { writeType === 'review' && 
          <button onClick={writeReview}>Submit Review</button>
        }
        { writeType === 'comment' && 
          <button onClick={writeComment}>Post Comment</button>
        }
      </form>
    </div>
  )
}
