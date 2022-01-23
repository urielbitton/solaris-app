import { db } from '../firebase/fire'

export function setDB(col, doc, value, merge=false) {
  return db.collection(col).doc(doc).set(value, {merge})
}

export function updateDB(col, doc, value) {
  return db.collection(col).doc(doc).update(value)
}

export function deleteDB(col, doc) {
  return db.collection(col).doc(doc).delete()
}

export function setSubDB(col, doc, subCol, subDoc, value, merge=false) {
  return db.collection(col).doc(doc).collection(subCol).doc(subDoc).set(value, {merge})
}

export function updateSubDB(col, doc, subCol, subDoc, value) {
  return db.collection(col).doc(doc).collection(subCol).doc(subDoc).update(value)
}

export function deleteSubDB(col, doc, subCol, subDoc) {
  return db.collection(col).doc(doc).collection(subCol).doc(subDoc).delete()
}

export const addDB = (col, value) => {
  return db.collection(col).add(value)
}

export const addSubDB = (col, doc, subCol, value) => {
  return db.collection(col).doc(doc).collection(subCol).add(value)
}