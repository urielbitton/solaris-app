import { db } from "../firebase/fire";

export const getInstructorByID = (instructorID, setInstructor) => {
  db.collection('instructors').doc(instructorID).onSnapshot(snap => {
    setInstructor(snap.data())
  })
}

export const getAllInstructors = (setInstructor, limit) => {
  db.collection('instructors').onSnapshot(snap => {
    const instructorsArr = []
    snap.forEach(doc => instructorsArr.push(doc.data()))
    setInstructor(instructorsArr)
  })
}

export const getReviewsByInstructorID = (instructorID, setReviews, limit) => {
  db.collection('instructors').doc(instructorID).collection('reviews').onSnapshot(snap => {
    const reviewsArr = []
    snap.forEach(doc => reviewsArr.push(doc.data()))
    setReviews(reviewsArr)
  })
}

export const getCoursesByInstructorID = (instructorID, setCourses, limit) => {
  db.collection('courses').where('instructorID', '==', instructorID).limit(limit).onSnapshot(snap => {
    const coursesArr = []
    snap.forEach(doc => coursesArr.push(doc.data()))
    setCourses(coursesArr)
  })
}