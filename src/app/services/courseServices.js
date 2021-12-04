import { db } from '../firebase/fire'

export const getAllCourses = (setCourses, limit) => {
  db.collection('courses').limit(limit).onSnapshot(snap => {
    const coursesArr = []
    snap.forEach(doc => coursesArr.push(doc.data()))
    setCourses(coursesArr)
  })
}

export const getCoursesByClass = (courseClass, setCourses, limit) => {
  db.collection('courses').where('courseClass', '==', courseClass).limit(limit).onSnapshot(snap => {
    const coursesArr = []
    snap.forEach(doc => coursesArr.push(doc.data()))
    setCourses(coursesArr)
  })
}

export const getCourseByID = (courseID, setCourse) => {
  db.collection('courses').doc(courseID).onSnapshot(snap => {
    setCourse(snap.data())
  })
}

export const getLessonsByCourseID = (courseID, setLessons) => {
  db.collection('courses').doc(courseID).collection('lessons').onSnapshot(snap => {
    const lessonsArr = []
    snap.forEach(doc => lessonsArr.push(doc.data()))
    setLessons(lessonsArr) 
  })
}

export const getVideosByLessonID = (courseID, lessonID, setVideos) => {
  db.collection('courses').doc(courseID).collection('lessons').doc(lessonID).collection('videos').onSnapshot(snap => {
    const videosArr = []
    snap.forEach(doc => videosArr.push(doc.data()))
    setVideos(videosArr) 
  })
}

export const getReviewsByCourseID = (courseID, setReviews) => {
  db.collection('courses').doc(courseID).collection('reviews').orderBy('dateAdded', 'desc').onSnapshot(snap => {
    const reviewsArr = []
    snap.forEach(doc => reviewsArr.push(doc.data()))
    setReviews(reviewsArr) 
  })
}
