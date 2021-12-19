import { setDB, updateDB } from "./CrudDB"
import firebase from 'firebase'
import { db } from "../firebase/fire"

export const CreateCourse = (courseID, lessons, myUser, courseObject) => {
  const batch = db.batch()
  return setDB('courses', courseID, courseObject).then(() => {
    updateDB('instructors', myUser?.instructorID, {
      'coursesTaught': firebase.firestore.FieldValue.arrayUnion(courseID)
    })
    updateDB('admin', 'courseSettings', {
      'coursesCount': firebase.firestore.FieldValue.increment(1)
    })
    lessons.forEach(lesson => {
      const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID)
      batch.set(docRef, {lessonID: lesson?.lessonID, lessonType: 'video', title: lesson?.title, videoType: lesson?.videoType})
    })
    lessons.forEach(lesson => {
      lesson.videos.forEach(video => {
        const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID).collection('videos').doc(video?.videoID)
        batch.set(docRef, {
          videoID: video?.videoID, title: video?.title, duration: video?.duration, url: video?.url, dateAdded: new Date()
        })
      })
    })
    lessons.forEach(lesson => {
      lesson.notes.forEach(note => {
        const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID).collection('notes').doc(note?.noteID)
        batch.set(docRef, {noteID: note?.noteID, text: note?.text, title: note?.title, dateAdded: new Date()})
      })
    })
    return batch.commit()
  })
}

export const saveCourse = (courseID, lessons, courseObject) => {
  const batch = db.batch()
  return updateDB('courses', courseID, courseObject).then(() => {
    lessons.forEach(lesson => {
      const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID)
      batch.set(docRef, {lessonID: lesson?.lessonID, lessonType: 'video', title: lesson?.title, videoType: lesson?.videoType}, {merge: true})
    })
    lessons.forEach(lesson => {
      const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID)
      batch.set(docRef, {lessonID: lesson?.lessonID, lessonType: 'video', title: lesson?.title, videoType: lesson?.videoType}, {merge: true})
    })
    lessons.forEach(lesson => {
      lesson.videos.forEach(video => {
        const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID).collection('videos').doc(video?.videoID)
        batch.set(docRef, {videoID: video?.videoID, title: video?.title, duration: video?.duration, url: video?.url, dateAdded: new Date()}, {merge: true})
      })
    })
    lessons.forEach(lesson => {
      lesson.notes.forEach(note => {
        const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID).collection('notes').doc(note?.noteID)
        batch.set(docRef, {noteID: note?.noteID, text: note?.text, title: note?.title, dateAdded: new Date()}, {merge: true})
      })
    })
    return batch.commit()
  })
}