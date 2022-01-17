import firebase from 'firebase'

export const uploadImgToFireStorage = async (e, path, imgName, setURL, setLoading) => {
  const storageRef = firebase.storage().ref(path).child(imgName)

  const file = e.target.files[0]
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
        // setLoading(false)
        storageRef.getDownloadURL().then((url) => {
          setURL(url)
        })
      }
    )
  }
}