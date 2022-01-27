import { db } from "../firebase/fire"

export const getCourseCategories = (setCategories) => {
  db.collection('admin')
  .doc('courseSettings')
  .collection('categories')
  .orderBy('name', 'asc')
  .onSnapshot(snap => {
    const categoriesArr = []
    snap.forEach(doc => categoriesArr.push(doc.data()))
    setCategories(categoriesArr)
  })
}

export const getCoursesCount = (setCount) => {
  db.collection('admin')
  .doc('courseSettings')
  .onSnapshot(snap => {
    setCount(snap.data().coursesCount)
  })
}

export const getInstructorsCount = (setCount) => {
  db.collection('admin')
  .doc('instructorSettings')
  .onSnapshot(snap => {
    setCount(snap.data().instructorsCount)
  })
}

export const getInstructorApplications = (setApplications, limit) => {
  db.collection('instructorApplications')
  .limit(limit)
  .onSnapshot(snap => {
    const applicationsArr = []
    snap.forEach(doc => applicationsArr.push(doc.data()))
    setApplications(applicationsArr)
  })
}

export const getAllEmails = (setEmails, limit) => {
  db.collection('mail')
  .limit(limit)
  .onSnapshot(snap => {
    const emailsArr = []
    snap.forEach(doc => emailsArr.push(doc.data()))
    setEmails(emailsArr)
  })
}

export const getAllIncidents = (setIncidents, limit) => {
  db.collection('incidents')
  .limit(limit)
  .onSnapshot(snap => {
    const incidentArr = []
    snap.forEach(doc => incidentArr.push(doc.data()))
    setIncidents(incidentArr)
  })
}

export const getAdminAccountInfo = (setInfo) => {
  db.collection('admin')
  .doc('account')
  .onSnapshot(snap => {
    setInfo(snap.data())
  })
}

export const getAdminGeneralSettings = (setSettings) => {
  db.collection('admin')
  .doc('generalSettings')
  .onSnapshot(snap => {
    setSettings(snap.data())
  })
}

export const getAllStudents = (setStudents, limit) => {
  db.collection('users')
  .where('isInstructor', '!=', true)
  .onSnapshot(snap => {
    const studentsArr = []
    snap.forEach(doc => studentsArr.push(doc.data()))
    setStudents(studentsArr)
  })
}