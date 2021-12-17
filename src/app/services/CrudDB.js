import { db } from '../firebase/fire'

export function setDB(col, doc, value) {
  return db.collection(col).doc(doc).set(value)
}

export function updateDB(col, doc, value) {
  return db.collection(col).doc(doc).update(value)
}

export function deleteDB(col, doc) {
  return db.collection(col).doc(doc).delete()
}

export function setSubDB(col, doc, subCol, subDoc, value) {
  return db.collection(col).doc(doc).collection(subCol).doc(subDoc).set(value)
}

export function updateSubDB(col, doc, subCol, subDoc, value) {
  return db.collection(col).doc(doc).collection(subCol).doc(subDoc).update(value)
}

export function deleteSubDB(col, doc, subCol, subDoc) {
  return db.collection(col).doc(doc).collection(subCol).doc(subDoc).delete()
}