import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import LessonsList from '../components/course/LessonsList'
import WriteComment from '../components/course/WriteComment'
import { getCourseByID, getLessonByID, getLessonsByCourseID, 
  getVideosByLessonID, getVideoByID, getCommentsByVideoID, 
  getNotesByLessonID, getAllVideosByCourseID, getLessonNotesByUserAndLessonID } from '../services/courseServices'
import { StoreContext } from '../store/store'
import './styles/LessonPage.css'
import VideoEmbed from '../components/course/VideoEmbed'
import CommentCard from '../components/course/CommentCard'
import { getCoursesIDEnrolledByUserID } from '../services/userServices'
import lockedImg from '../assets/imgs/locked-content.png'
import { convertFireDateToString } from '../utils/utilities'
import { useWindowDimensions } from "../utils/customHooks"
import { deleteSubDB, setSubDB } from "../services/CrudDB"

export default function LessonPage() {

  const {setNavTitle, setNavDescript, user} = useContext(StoreContext)
  const courseID = useRouteMatch('/courses/course/:courseID')?.params.courseID
  const lessonID = useRouteMatch('/courses/course/:courseID/lesson/:lessonID')?.params.lessonID
  const videoID = useRouteMatch('/courses/course/:courseID/lesson/:lessonID/:videoID')?.params.videoID
  const [course, setCourse] = useState([])
  const [lessons, setLessons] = useState([])
  const [videos, setVideos] = useState([])
  const [lesson, setLesson] = useState({})
  const [video, setVideo] = useState({})
  const [notes, setNotes] = useState([])
  const [comments, setComments] = useState([])
  const [userCourses, setUserCourses] = useState([])
  const [foldSidebar, setFoldSidebar] = useState(false)
  const [allCourseVideos, setAllCourseVideos] = useState([])
  const [playPosition, setPlayPosition] = useState(0)
  const [myLessonNotes, setMyLessonNotes] = useState({})
  const [showAddNotes, setShowAddNotes] = useState(false)
  const [myNotesText, setMyNotesText] = useState('')
  const courseUserAccess = userCourses.findIndex(x => x.courseID === courseID) > -1
  const history = useHistory()
  const { screenWidth } = useWindowDimensions()
 
  const commentsRender = comments?.map((comment,i) => {
    return <CommentCard 
      comment={comment} 
      key={i} 
      type="comment"
      courseID={courseID}
      lessonID={lessonID}
      videoID={videoID}
    />
  })

  const lessonNotesRender = notes?.map((note,i) => {
    return <div className='lesson-note-section' key={'note'+i}>
      <div>
        <h4>{note.title}</h4>
        <small>{convertFireDateToString(note.dateAdded)}</small>
      </div>
      <p>{note.text}</p>
    </div>
  })

  const addCustomNotes = () => {
    if(myNotesText.length) {
      setSubDB('users', user?.uid, 'lessonNotes', lessonID, {
        dateAdded: new Date(),
        lessonNoteID:  lessonID,
        text: myNotesText
      }, true)
      .then(() => {
        setShowAddNotes(false)
        setMyNotesText('')
      })
      .catch(error => {
        console.log(error)
        window.alert('There was an error saving your notes. Please try again later.')
      })
    }
  }

  const prepareMyNotesEdit = () => {
    setShowAddNotes(true)
    setMyNotesText(myLessonNotes?.text)
  }

  const handleEnterPress = (e) => {
    if(e.key === 'Enter' && e.shiftKey) return
    else if(e.key === 'Enter') {
      e.preventDefault()
      addCustomNotes()
    }
  }

  const deleteNote = () => {
    const confirm = window.confirm('Are you sure you want to delete this note?')
    if(confirm) {
      deleteSubDB('users', user?.uid, 'lessonNotes', lessonID)
      .then(() => {
        setMyNotesText('')
        setShowAddNotes(false)
      })
      .catch(error => {
        window.alert('There was an error deleting your notes. Please try again later.')
        console.log(error)
      })
    }
  }

  useEffect(() => {
    getLessonsByCourseID(courseID, setLessons)
    getCourseByID(courseID, setCourse)
    if(!allCourseVideos.length) {
      getAllVideosByCourseID(courseID, setAllCourseVideos) 
    }
  },[courseID])

  useEffect(() => {
    getLessonByID(courseID, lessonID, setLesson)
    getVideosByLessonID(courseID, lessonID, setVideos)
    getNotesByLessonID(courseID, lessonID, setNotes)
  },[lessonID])

  useEffect(() => {
    getVideoByID(courseID, lessonID, videoID, setVideo)
    getCommentsByVideoID(courseID, lessonID, videoID, setComments)
  },[videoID])

  useEffect(() => {
    getCoursesIDEnrolledByUserID(user?.uid, setUserCourses)
  },[user])

  useEffect(() => {
    setNavTitle('Lesson')
    setNavDescript(course?.title)
  },[course])  

  useEffect(() => {
    getLessonNotesByUserAndLessonID(user?.uid, lessonID, setMyLessonNotes)
  },[user, lessonID])

  // useEffect(() => { //buggy code - review 
  //   if(allCourseVideos.length) {
  //     setPlayPosition(allCourseVideos.findIndex(x => x === `${lessonID}/${videoID}`))
  //   }
  // },[allCourseVideos])

  // useEffect(() => {
  //   if(courseID.length && lessonID.length && allCourseVideos.length) {
  //     history.push(`/courses/course/${courseID}/lesson/${allCourseVideos[playPosition]}`)
  //   }
  // },[courseID, playPosition])

  return (
    <div className="lesson-page">
      <div className={`lesson-sidebar ${foldSidebar ? "folded" : ""}`}>
        <div className='lesson-sidebar-container hidescroll'>
          <LessonsList 
            lessons={lessons} 
            courseID={courseID} 
            showSearch
            activeLesson={lessonID}
            courseUserAccess={courseUserAccess}
            videoTitleLength={screenWidth < 1370 ? 100 : 32}
          />
        </div>
        <div className='side-bar-latch' onClick={() => setFoldSidebar(prev => !prev)}>
          <i className={`fal fa-angle-${foldSidebar ? "right" : "left"}`}></i>
        </div>
      </div>
      <div className={`lesson-content ${foldSidebar ? "full" : ""}`}>
        <div className="lesson-video-container">
          <div className='title-row'>
            <h3>Lesson: {lesson?.title}</h3>
            <button onClick={() => history.push(`/courses/course/${courseID}`)}><i className='fal fa-arrow-left'></i>Back to Course</button>
          </div>
          <h6>{videos.length} video{videos.length !== 1 ? "s" : ""} in this lesson</h6>
          <h6 className='video-title'>{video?.title}</h6>
          { courseUserAccess ? 
          <>
            <VideoEmbed 
              embedUrl={lesson.videoType === "youtube" ? `https://www.youtube.com/embed/${video?.url?.split('v=')[1]}` : video?.url}
            />
            <div className="video-actions-nav">
              <button 
                className="shadow-hover"
                onClick={() => playPosition > 0 && setPlayPosition(prev => prev - 1)}
              >
                Previous
              </button>
              <button 
                className="shadow-hover"
                onClick={() => playPosition < allCourseVideos.length-1 && setPlayPosition(prev => prev + 1)}
              >
                Next
              </button>
            </div>
            <div className="lesson-text-contents">
              <h3 className="page-title">Lesson Material</h3>
              <div className='lesson-material'>
                {lessonNotesRender}
              </div>
            </div>
            <div className="lesson-my-notes-section">
              <h3 className="page-title">My Notes</h3>
              <div className="my-notes-container">
              { 
                myLessonNotes?.text &&
                <p className={showAddNotes ? "fade" : ""}>
                  {myLessonNotes?.text}
                  <i className="fal fa-pen" onClick={() => prepareMyNotesEdit()}></i>
                  <i className="fal fa-trash-alt delete" onClick={() => deleteNote()}></i>
                </p>
              }
              {
                showAddNotes &&
                <>
                  <textarea 
                    onChange={(e) => setMyNotesText(e.target.value)}
                    value={myNotesText} 
                    onKeyPress={(e) => handleEnterPress(e)}
                  /> 
                  <div className="btn-group">
                    <button onClick={() => addCustomNotes()}>Save</button>
                    <button onClick={() => setShowAddNotes(false)}>Cancel</button>
                  </div>
                </>
              }
              { !myLessonNotes?.text && !showAddNotes &&
                <button 
                  className="shadow-hover"
                  onClick={() => {
                    setShowAddNotes(true)
                    setMyNotesText(myLessonNotes?.text)
                  }}
                >Add Notes</button>
              }
              </div>
            </div>
            <div className="seperator"/>
            <div className="lesson-comments-section">
              <h3 className="page-title">Comments ({comments.length})</h3>
              <div className="comments-container">
                {commentsRender}
              </div>
            </div>
            <div className="leave-reply-section">
              <WriteComment 
                courseID={courseID}
                lessonID={lessonID}
                videoID={videoID}
                writeType="comment"
                mainTitle="Leave a Reply"
                messageInput="Enter Reply"
              />
            </div>
          </> :
        <div className="locked-content">
          <h3>This lesson is locked.</h3>
          <h5>Please purchase the course in order to view this lesson.</h5>
          <img src={lockedImg} alt="" />
          <button className="shadow-hover" onClick={() => history.push(`/checkout/course/${courseID}`)}>Purchase Course</button>
        </div>
        }
      </div>
      </div>
    </div>
  )
}
