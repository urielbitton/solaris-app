import React, { useContext, useState } from 'react'
import StarRate from '../ui/StarRate'
import './styles/WriteComment.css'
import { AppInput, AppTextarea } from '../ui/AppInputs'
import { StoreContext } from '../../store/store'
import { setSubDB } from '../../services/CrudDB'
import { db } from '../../firebase/fire' 
import { createNewNotification } from '../../services/notificationsServices'

export default function WriteComment(props) {

  const {user, myUser} = useContext(StoreContext)
  const {course, instructor, courseID, lessonID, videoID, writeType, mainTitle, 
    titleInput, messageInput, lesson, canReview} = props
  const [rating, setRating] = useState(1)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const reviewType = writeType === 'review'
  const commentType = writeType === 'comment'

  const newCommentID = db.collection('courses').doc(courseID)
    .collection('lessons').doc(lessonID)
    .collection('videos').doc(videoID)
    .collection('comments').doc().id

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
    if(title.length && text.length && canReview) {
      const newReviewID = db.collection('courses')
      .doc(courseID)
      .collection('reviews')
      .doc().id
      const reviewObj = {
        authorImg: myUser?.photoURL ?? "https://i.imgur.com/D4fLSKa.png",
        authorName: `${myUser?.firstName} ${myUser?.lastName}`,
        dateAdded: new Date(),
        rating: +rating,
        title,
        text,
        userID: user?.uid ?? "na"
      }
      setSubDB('courses', courseID, 'reviews', newReviewID, reviewObj)
      .then(res => {
        setTitle('')
        setText('')
        setRating(1)
        window.alert('Your review has been submitted.')
        createNewNotification(
          instructor?.instructorUserID,
          'New Review', 
          `${myUser?.firstName} ${myUser?.lastName} left a review on your course '${course?.title}.'`,
          `/courses/course/${courseID}`,
          'fal fa-comment-alt'
        )
      })
      .catch(err => {
        console.log(err)
        window.alert('There was an error while trying to submit your review. Please try again later.')
      })
    }
  }

  const writeComment = () => {
    if(text.length && canReview) {
      db.collection('courses').doc(courseID)
      .collection('lessons').doc(lessonID)
      .collection('videos').doc(videoID)
      .collection('comments').doc(newCommentID).set({
        authorImg: myUser?.photoURL,
        authorName: user?.displayName,
        dateAdded: new Date(),
        likes: [],
        text,
        commentID: newCommentID,
        userID: user?.uid
      }).then(() => {
        setText('')
        createNewNotification(
          instructor?.instructorUserID,
          'New Comment', 
          `${myUser?.firstName} ${myUser?.lastName} left a comment on your course lesson ${lesson?.title}'`,
          `/courses/course/${courseID}/lesson/${lessonID}/${videoID}`,
          'fal fa-comment-alt'
        )
      })
      .catch(err => console.log(err))
    }
    else {
      window.alert('Fill in title and text fields to post a comment.')
    }
  }

  return (
    <div 
      className="add-comment-container"
      style={{display: canReview ? 'flex' : 'none'}}
    >
      <h3>{mainTitle}</h3>
      { reviewType &&
        <div className="rating-setter"> 
          {starsRender}
          <AppInput 
            onChange={(e) => setRating(e.target.value)} 
            type="number" 
            min={1} 
            max={5} 
            value={rating < 5 ? rating : 5} 
            step={0.1}
          />
          <small>*Enter decimal values here.</small>
        </div>
      }
      <form onSubmit={(e) => e.preventDefault()}>
        { reviewType &&
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
        { reviewType && 
          <button onClick={writeReview}>Submit Review</button>
        }
        { commentType && 
          <button onClick={writeComment}>Post Comment</button>
        }
      </form>
    </div>
  )
}
