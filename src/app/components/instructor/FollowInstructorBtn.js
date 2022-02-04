import React from 'react'
import firebase from 'firebase'
import { deleteSubDB, setSubDB, updateDB } from '../../services/CrudDB'
import { createNewNotification } from "../../services/notificationsServices"

export default function FollowInstructorBtn(props) {

  const { isCurrentUserFollowing, instructor, currentUserID, myUser } = props

  const toggleFollowInstructor = () => {
    if(!isCurrentUserFollowing) {
      setSubDB('instructors', instructor?.instructorID, 'followers', currentUserID, {
        userID: currentUserID,
        name: `${myUser?.firstName} ${myUser?.lastName}`
      })
      .then(() => {
        updateDB('instructors', instructor?.instructorID, {
          followersCount: firebase.firestore.FieldValue.increment(1)
        })
        createNewNotification(
          instructor?.instructorUserID,
          'New Follower',
          `${myUser?.firstName} ${myUser?.lastName} is now following you.`,
          `/instructors/instructor/${instructor?.instructorID}`,
          'fal fa-user-plus'
        )
      })
    }
    else {
      deleteSubDB('instructors', instructor?.instructorID, 'followers', currentUserID)
      .then(() => {
        updateDB('instructors', instructor?.instructorID, {
          followersCount: firebase.firestore.FieldValue.increment(-1)
        })
      })
    }
  }

  return (
    <button 
      className="shadow-hover"
      onClick={() =>  instructor?.instructorID !== myUser?.instructorID && toggleFollowInstructor()}
      disabled={instructor?.instructorID === myUser?.instructorID}
    >
      { isCurrentUserFollowing ? "Following" : "Follow" }
      <i className={isCurrentUserFollowing ? "fal fa-check" : "fal fa-plus"}></i>
    </button>
  )
}
