import firebase from 'firebase'

export const uploadImgToFireStorage = (e, storagePath, fileName) => {
  return new Promise((resolve, reject) => {

    const storageRef = firebase.storage().ref(storagePath).child(fileName)
    let file = e.target.files[0]

    if(file) {
      const task = storageRef.put(file)
      task.on("stat_changes", 
        function progress(snap) {
          // setLoading(true)
          // const percent = (snap.bytesTransferred / snap.totalBytes) * 100
          // loadingRef.current.style.width = percent + '%'
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