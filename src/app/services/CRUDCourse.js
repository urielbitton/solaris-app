import { deleteDB, deleteSubDB, setDB, updateDB } from "./CrudDB"
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
    lessons.forEach((lesson,i) => {
      const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID)
      batch.set(docRef, {lessonID: lesson?.lessonID, lessonType: 'video', title: lesson?.title, videoType: lesson?.videoType, order:(i+1)})
    })
    lessons.forEach((lesson) => {
      lesson.videos.forEach((video,i) => {
        const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID).collection('videos').doc(video?.videoID)
        batch.set(docRef, {
          videoID: video?.videoID, title: video?.title, duration: video?.duration, url: video?.url, dateAdded: new Date(), order: (i+1)
        })
      })
    })
    lessons.forEach(lesson => {
      lesson.notes.forEach((note,i) => {
        const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID).collection('notes').doc(note?.noteID)
        batch.set(docRef, {noteID: note?.noteID, text: note?.text, title: note?.title, dateAdded: new Date(), order:(i+1)})
      })
    })
    return batch.commit()
  })
}

export const saveCourse = (courseID, lessons, courseObject, deletedLessons) => {
  const batch = db.batch()
  deletedLessons.forEach(lesson => {
    const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID)
    batch.delete(docRef)
  })
  return setDB('courses', courseID, courseObject, true).then(() => {
    lessons.forEach(lesson => {
      const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID)
      batch.set(docRef, {lessonID: lesson?.lessonID, lessonType: 'video', title: lesson?.title, videoType: lesson?.videoType, order: lesson?.order}, {merge: true})
    })
    lessons.forEach(lesson => {
      lesson.videos.forEach(video => {
        const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID).collection('videos').doc(video?.videoID)
        batch.set(docRef, {videoID: video?.videoID, title: video?.title, duration: video?.duration, url: video?.url, dateAdded: new Date(), order: video?.order}, {merge: true})
      })
    })
    lessons.forEach(lesson => {
      lesson.notes.forEach(note => {
        const docRef = db.collection('courses').doc(courseID).collection('lessons').doc(lesson?.lessonID).collection('notes').doc(note?.noteID)
        batch.set(docRef, {noteID: note?.noteID, text: note?.text, title: note?.title, dateAdded: new Date(), order: note?.order}, {merge: true})
      })
    })
    return batch.commit()
  })
}

export const deleteCourse = (courseID, myUser) => {
  const batch = db.batch()
  return deleteDB('courses', courseID).then(() => {
    updateDB('instructors', myUser?.instructorID, {
      'coursesTaught': firebase.firestore.FieldValue.arrayRemove(courseID)
    })
    updateDB('admin', 'courseSettings', {
      'coursesCount': firebase.firestore.FieldValue.increment(-1)
    })
  })
}