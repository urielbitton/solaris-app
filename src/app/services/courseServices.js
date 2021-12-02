import firebase from 'firebase'
import { db } from '../firebase/fire'

export const getCoursesByClass = (courseClass, setCourses) => {
  db.collection('courses').where('courseClass', '==', courseClass).onSnapshot(snap => {
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