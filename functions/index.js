const functions = require("firebase-functions")
const admin = require("firebase-admin")

const algoliasearch = require('algoliasearch')

const APP_ID = functions.config().algolia.app
const ADMIN_KEY = functions.config().algolia.key

const client = algoliasearch(APP_ID, ADMIN_KEY)
const index = client.initIndex('courses_index')

index.search('query', {
  hitsPerPage: 2
})

exports.addToIndex = functions.firestore.document('courses/{courseID}').onCreate(snapshot => {
  const data = snapshot.data()
  const objectID = snapshot.id
  return index.addObject({...data, objectID})
})

exports.updateIndex = functions.firestore.document('courses/{courseID}').onUpdate((change) => {
  const newData = change.after.data()
  const objectID = change.after.id
  return index.saveObject({...newData, objectID})
})

exports.deleteFromIndex = functions.firestore.document('courses/{courseID}').onDelete(snapshot => {
  index.deleteObject(snapshot.id)
})

admin.initializeApp({
  credential: admin.credential.cert({
      projectId: "solaris-app-22479",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9C5JlFFAHMagF\nr/b9NRHIKCI7r1rFzpfX2X5N91N3p3mLOwcA78SRT9hN5VepAMCW+9M+1d1F1kyN\nb7ALXmPZAyHrO5HKg1cq2DG+vb72TcPudJPilsqden1yOb3hpB+4txFFGaf3BDjV\n/RvDNkcOIQRAiHVZr/eYWb2VGq71iPvAmRSh1a8YhzWcTtf46dXVa9qMnTWGRNmm\nY8uWljPCl694lsc9PgebwhH3GyNA5NKPH60Es35lJBPSL1WkqdM9BtIdLWXs4PFV\nicBp7NZjgU8mh3GG8bEZ5XPBgIyKjN7rXXCzUSvZl8r6uMw+ZOlCU4QGr2DDWMJ5\nmXBkAweHAgMBAAECggEAH2iTR5Dy5OcWo+9C6XnOPQOSAHmXasLyzm13wyti5j/g\nfUXu2XR8o6nw5axDfrQ9yzgGtmtg6o/6wwr55EGn9C/FjGgmxk9BBcDKrwamehSc\nh3s98Mkd28E0o2w9hIY4sP9VcrYbBnrgmIkHek0DzDCnHLOvT5nhWKIcUfAPfoKc\nqy3CcliHYHHSnyHxw3/sCeuTRtyw7s/KUKaetlg7Bm5HsJhm7qsaY7cvJex1jHiJ\nHOxyQQ+A29JoW8khPKhp4fdryMLxCT8X6gEPWZOT+MGIWg+OEFuvrLvRVY7Us4ds\nHi5NgwzEKiI0p9EfWM83La8Q7ZRybnnmKgdKxNClDQKBgQD5Dpzqy4s2fKFDI+Xk\ns1fME+kRfAEZe+y13TG0yGAkOgFKHYcvQRyK/BTN4mlTpCSzu85Td1b5ApJuIzIC\nq01Lkv+prp4nzAyaa7+opT+nD5v9u+iMoEtfF8YS43DDAmFN+nYz+36wRCCurtxV\nXfE8cr4ALQcbar7uZoSyPAJ94wKBgQDCUK+t1lys2eRk1EEZ++fvT0eggoKCxZe+\n9c80cSfi9u3suTVvHvwvZ+4u4hKhTxdtPFoaftNWA68RKOUDXuPt2JKbmK+fRX3r\nv2NLUySzvu4AuXGS3HmsDraBeuxopW1AqP8hshE0himihTW4Xk4Ux3GHXJffJTiz\ndGTuliRBDQKBgQCxF3rsWR7791KTcwscu4lKSz4GeK4veLav+kBF09TI7ZXNJYHi\nT+ID0YrZeox6NNUEGB51qv3kwbdtKQl+bF/hxPyVotxCYAz2IHd/a0D/gVHh8aNB\nmxj83OKyu5aKkz6tO9Kg08sZetfiXeO9r7bAzLXdWicbj6OD0NG6CoGbEQKBgGZp\nuj3n5g5gBOUzjWBRiUtywHCTeI/N7o2B5oRgQ0J3HK0QbF41uXqOz1U8Z89G7TTw\ngxjF0ULbTDDCGfmt0HmyFIsXbTCHordWttGjb4ugzLXrBzX9J8+MLZqOm/0He06C\nA33R6QmC0HzMsqSKZ6LB/071eUHtzzWd2fh5f4AdAoGAGbEt+Nq0s1l1UoSUXwBl\nLpsQufyFf65FHsoO1uLaXEU5bjWS0EEn5wOqiOa1SoqS1q+ZT5YbS/2cAQ+Y+YzZ\nLGTxRfx5T6F+bEgfbqlQPtx8AeDfH9F3RGx5QW/qawrgFhHqFqyOntIsM1iF6Tz5\nCpfqzUyAhawXdKk7h1QZhA4=\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
      clientEmail: "firebase-adminsdk-wviey@solaris-app-22479.iam.gserviceaccount.com",
  })
})

exports.sendEmails = functions.firestore.document('users/{userID}/emails/{emailID}').onCreate(snapshot => {
  const data = snapshot.data()
  admin
  .firestore()
  .collection('mail')
  .add({
    to: data.email,
    message: {
      subject: data.subject,
      html: data.html,
    },
    dateSent: data.dateSent
  })
  .then((res) => console.log(res))
  .catch(err => console.log(err))
})