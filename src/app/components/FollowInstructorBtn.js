import React from 'react'
import { db } from "../firebase/fire"
import firebase from 'firebase'

export default function FollowInstructorBtn(props) {

  const { isCurrentUserFollowing, instructorID, currentUserID } = props

  const toggleFollowInstructor = () => {
    if(!isCurrentUserFollowing) {
      db.collection('instructors').doc(instructorID).collection('followers').doc(currentUserID).set({
        "userID": currentUserID
      }).then(() => {
        db.collection('instructors').doc(instructorID).update({
          followersCount: firebase.firestore.FieldValue.increment(1)
        })
      })
    }
    else {
      db.collection('instructors').doc(instructorID).collection('followers').doc(currentUserID).delete()
      .then(() => {
        db.collection('instructors').doc(instructorID).update({
          followersCount: firebase.firestore.FieldValue.increment(-1)
        })
      })
    }
  }

  return (
    <button 
      className="shadow-hover"
      onClick={() =>  toggleFollowInstructor()}
    >
      { isCurrentUserFollowing ? "Following" : "Follow" }
      <i className={isCurrentUserFollowing ? "fal fa-check" : "fal fa-plus"}></i>
    </button>
  )
}
