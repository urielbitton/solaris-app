import { db } from '../firebase/fire'

export const getAllCourses = (setCourses, limit, orderBy='dateCreated', direction='desc') => {
  db.collection('courses')
  .orderBy(orderBy, direction)
  .limit(limit)
  .onSnapshot(snap => {
    const coursesArr = []
    snap.forEach(doc => coursesArr.push(doc.data()))
    setCourses(coursesArr)
  })
}

export const getFeaturedCourses = (setCourses, limit) => { 
  db.collection('courses')
  .where('featuredCourse', '==', true)
  .limit(limit)
  .onSnapshot(snap => {
    const coursesArr = []
    snap.forEach(doc => coursesArr.push(doc.data()))
    setCourses(coursesArr)
  })
}

export const getNewCourses = (xDaysAgo, setCourses, limit) => { //new courses are less than "xDaysAgo var" old from dateCreated
  db.collection('courses')
  .where('dateCreated', '>=', xDaysAgo)
  .where('dateCreated', '<=', new Date())
  .limit(limit).onSnapshot(snap => {
    const coursesArr = []
    snap.forEach(doc => coursesArr.push(doc.data()))
    setCourses(coursesArr)
  })
}

export const getCourseByID = (courseID, setCourse) => {
  db.collection('courses').doc(courseID)
  .onSnapshot(snap => {
    setCourse(snap.data())
  })
}

export const getLessonsByCourseID = (courseID, setLessons) => {
  db.collection('courses').doc(courseID)
  .collection('lessons').orderBy('order', 'asc')
  .onSnapshot(snap => {
    const lessonsArr = []
    snap.forEach(doc => lessonsArr.push(doc.data()))
    setLessons(lessonsArr) 
  })
}

export const getLessonByID = (courseID, lessonID, setLesson) => {
  db.collection('courses').doc(courseID)
  .collection('lessons').doc(lessonID)
  .onSnapshot(snap => {
    setLesson(snap.data())
  })
}

export const getVideosByLessonID = (courseID, lessonID, setVideos) => {
  db.collection('courses').doc(courseID)
  .collection('lessons').doc(lessonID)
  .collection('videos').orderBy('order', 'asc')
  .onSnapshot(snap => {
    const videosArr = []
    snap.forEach(doc => videosArr.push(doc.data()))
    setVideos(videosArr) 
  })
}

export const getNotesByLessonID = (courseID, lessonID, setNotes) => {
  db.collection('courses').doc(courseID)
  .collection('lessons').doc(lessonID)
  .collection('notes').orderBy('order', 'asc')
  .onSnapshot(snap => {
    const notesArr = []
    snap.forEach(doc => notesArr.push(doc.data()))
    setNotes(notesArr) 
  })
}

export const getVideoByID = (courseID, lessonID, videoID, setVideo) => {
  db.collection('courses').doc(courseID)
  .collection('lessons').doc(lessonID)
  .collection('videos').doc(videoID)
  .onSnapshot(snap => {
    setVideo(snap.data())
  })
}

export const getCommentsByVideoID = (courseID, lessonID, videoID, setComments) => {
  db.collection('courses').doc(courseID)
  .collection('lessons').doc(lessonID)
  .collection('videos').doc(videoID)
  .collection('comments')
  .onSnapshot(snap => {
    const commentsArr = []
    snap.forEach(doc => commentsArr.push(doc.data()))
    setComments(commentsArr)
  })
}

export const getReviewsByCourseID = (courseID, setReviews) => {
  db.collection('courses').doc(courseID)
  .collection('reviews').orderBy('dateAdded', 'desc')
  .onSnapshot(snap => {
    const reviewsArr = []
    snap.forEach(doc => reviewsArr.push(doc.data()))
    setReviews(reviewsArr) 
  })
}

export const getAllVideosByCourseID = (courseID, setVideos) => {
  db.collection('courses').doc(courseID)
  .collection('lessons').get().then(snapshot => {
    snapshot.forEach(lessonDoc => {
      db.collection('courses').doc(courseID)
      .collection('lessons').doc(lessonDoc.id)
      .collection('videos')
      .get().then(videosDoc => {
        videosDoc.forEach(doc => {
          setVideos(prev => [...prev, `${lessonDoc.id}/${doc.id}`])
        })
      })
    })
  })
}

export const getAllQuizzesByCourseID = (courseID, setQuizes) => {
  db.collection('courses').doc(courseID)
  .collection('quizes')
  .orderBy('dateCreated', 'asc')
  .onSnapshot(snap => {
    const quizesArr = []
    snap.forEach(doc => quizesArr.push(doc.data()))
    setQuizes(quizesArr)
  })
}

export const getQuizByID = (courseID, quizID, setQuiz) => {
  db.collection('courses').doc(courseID)
  .collection('quizes').doc(quizID)
  .onSnapshot(snap => {
    setQuiz(snap.data())
  })
}

export const getQuestionsByQuizID = (courseID, quizID, setQuestions) => {
  db.collection('courses').doc(courseID)
  .collection('quizes').doc(quizID)
  .collection('questions')
  .orderBy('order', 'asc')
  .onSnapshot(snap => {
    const questionsArr = []
    snap.forEach(doc => questionsArr.push(doc.data()))
    setQuestions(questionsArr)
  })
}

export const getLessonNotesByUserAndLessonID = (userID, lessonID, setNotes) => {
  db.collection('users')
  .doc(userID)
  .collection('lessonNotes')
  .doc(lessonID)
  .onSnapshot(snap => {
    setNotes(snap.data())
  })
}

export const getStudentsByCourseID = (courseID, setStudents, limit) => {
  db.collection('courses')
  .doc(courseID)
  .collection('students')
  .limit(limit)
  .onSnapshot(snap => {
    const studentsArr = []
    snap.forEach(doc => studentsArr.push(doc.data()))
    setStudents(studentsArr)
  })
}