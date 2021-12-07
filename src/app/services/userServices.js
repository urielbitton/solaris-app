import { db } from "../firebase/fire"

export const getCoursesIDEnrolledByUserID = (userID, setCourses) => {
  db.collection('users').doc(userID).collection('coursesEnrolled').onSnapshot(snap => {
    const coursesArr = []
    snap.forEach(doc => coursesArr.push(doc.data()))
    setCourses(coursesArr)
  })
}

export const getCoursesEnrolledByUserID = (enrolledList, setCourses) => {
  db.collection('courses').where('id', 'in', enrolledList.length ? enrolledList : ['']).onSnapshot(snap => {
    const coursesArr = []
    snap.forEach(doc => coursesArr.push(doc.data()))
    setCourses(coursesArr)
  })
}

export const isUserInstructor = (userID, setIsInstructor) => {
  db.collection("users").doc(userID).get().then(doc => {
    if(doc.exists) {
      setIsInstructor(doc.data().isInstructor)
    }
  })
}