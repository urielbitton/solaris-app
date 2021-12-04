import { db } from "../firebase/fire"

export const getCourseCategories = (setCategories) => {
  db.collection('admin').doc('courseSettings').collection('categories').onSnapshot(snap => {
    const categoriesArr = []
    snap.forEach(doc => categoriesArr.push(doc.data()))
    setCategories(categoriesArr)
  })
}

export const getCoursesCount = (setCount) => {
  db.collection('admin').doc('courseSettings').onSnapshot(snap => {
    setCount(snap.data().coursesCount)
  })
}