import { db } from "../firebase/fire";

export const getInstructorByID = (instructorID, setInstructor) => {
  db.collection('instructors').doc(instructorID).onSnapshot(snap => {
    setInstructor(snap.data())
  })
}