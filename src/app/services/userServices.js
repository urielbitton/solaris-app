import { db } from "../firebase/fire"

//gets only the enrolled courses ids & title in user sub collection (not actual course)
export const getCoursesIDEnrolledByUserID = (userID, setCourses) => { 
  db.collection('users').doc(userID)
  .collection('coursesEnrolled')
  .onSnapshot(snap => {
    const coursesArr = []
    snap.forEach(doc => coursesArr.push(doc.data()))
    setCourses(coursesArr)
  })
}

//gets the actual course object that is matched in user enrolled courses collection
export const getCoursesEnrolledByUserID = (enrolledList, setCourses) => {
  db.collection('courses')
  .where('id', 'in', enrolledList.length ? enrolledList : [''])
  .onSnapshot(snap => {
    const coursesArr = []
    snap.forEach(doc => coursesArr.push(doc.data()))
    setCourses(coursesArr)
  })
}

export const isUserInstructor = (userID, setIsInstructor) => {
  db.collection("users").doc(userID)
  .get()
  .then(doc => {
    if(doc.exists) {
      setIsInstructor(doc.data().isInstructor)
    }
  })
}

export const getAllNotificationsByUserID = (userID, setNotifications, limit) => {
  db.collection('users').doc(userID)
  .collection('notifications')
  .orderBy('dateAdded', 'desc')
  .limit(limit)
  .onSnapshot(snap => {
    const notifsArr = []
    snap.forEach(doc => notifsArr.push(doc.data()))
    setNotifications(notifsArr)
  })
}

export const getUnreadNotificationsByUserID = (userID, setNotifications) => {
  db.collection('users').doc(userID)
  .collection('notifications')
  .where('read', '==', false)
  .onSnapshot(snap => {
    const notifsArr = []
    snap.forEach(doc => notifsArr.push(doc.data()))
    setNotifications(notifsArr)
  })
}

export const getQuizesTakenByUserID = (userID, setQuizes) => {
  db.collection('users').doc(userID)
  .collection('quizes')
  .onSnapshot(snap => {
    const quizesArr = []
    snap.forEach(doc => quizesArr.push(doc.data()))
    setQuizes(quizesArr)
  })
}

export const getUserQuizByID = (userID, quizID, setQuiz) => {
  db.collection('users').doc(userID)
  .collection('quizes').doc(quizID)
  .onSnapshot(snap => {
    setQuiz(snap.data())
  })
}

export const getCertificationsByUserID = (userID, setCertification) => {
  db.collection('users').doc(userID)
  .collection('certifications')
  .onSnapshot(snap => {
    const certifArr = []
    snap.forEach(doc => certifArr.push(doc.data()))
    setCertification(certifArr)
  })
}

export const getUserSettingsByUserAndDocID = (userID, docID, setSettings) => {
  db.collection('users').doc(userID)
  .collection('settings').doc(docID)
  .get()
  .then(snap => {
    setSettings(snap.data())
  })
}