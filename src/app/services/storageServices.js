import firebase from 'firebase'
import { db } from "../firebase/fire"

export const uploadImgToFireStorage = (e, storagePath, fileName) => {
  return new Promise((resolve, reject) => {

    const storageRef = firebase.storage().ref(storagePath).child(fileName)
    let file = e.target.files[0]

    if(file) {
      const task = storageRef.put(file)
      task.on("stat_changes", 
        function progress(snap) {
          
        },
        function error() {
          window.alert('An error has occured. Please try again later.')
        },
        function complete() {
          storageRef.getDownloadURL()
          .then((url) => {
            console.log('Successfully Resolved');
            resolve(url)
          })
          .catch(err => {
            console.log(err)
            reject()
          })
        }
      )
    }
  })
}

export const uploadMultipleFilesToFireStorage = (e, storagePath, collectionPath) => {
  return new Promise((resolve, reject) => {

    for (let i = 0; i < e.target.files.length; i++) {
      const filesLength = e.target.files.length
      const file = e.target.files[i]
      let storageRef = firebase.storage().ref(`${storagePath}/${file.name}`)
      
      if(file) {
        let task = storageRef.put(file)
        task.on('state_changed',
          function progress(snapshot){
          
          },
          function error(err){
            console.log(err)
          },
          function complete(){
            return storageRef.getDownloadURL()
            .then((url) => {
              const genDocID = db.collection(collectionPath).doc().id
              db.collection(collectionPath).doc(genDocID).set({
                fileID: genDocID,
                file: url,
                fileName: file?.name,
                fileSize: file?.size,
                fileType: file?.type
              }).then(() => {
                if(i === filesLength-1) {
                  resolve()
                }
              })
            })
            .catch(err => {
              console.log(err)
              reject()
            })
          }
        )
      }
    }
  })
}