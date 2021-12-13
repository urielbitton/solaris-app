import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import LessonsList from '../components/LessonsList'
import WriteComment from '../components/WriteComment'
import { getCourseByID, getLessonByID, getLessonsByCourseID, getVideosByLessonID, getVideoByID, getCommentsByVideoID, getNotesByLessonID, getAllVideosByCourseID } from '../services/courseServices'
import { StoreContext } from '../store/store'
import './styles/LessonPage.css'
import VideoEmbed from '../components/VideoEmbed'
import CommentCard from '../components/CommentCard'
import { getCoursesIDEnrolledByUserID } from '../services/userServices'
import lockedImg from '../assets/imgs/locked-content.png'
import { convertFireDateToString } from '../utils/utilities'
import { useWindowDimensions } from "../utils/customHooks"

export default function LessonPage() {

  const {setNavTitle, setNavDescript, user} = useContext(StoreContext)
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
  const courseID = useRouteMatch('/courses/course/:courseID')?.params.courseID
  const lessonID = useRouteMatch('/courses/course/:courseID/lesson/:lessonID')?.params.lessonID
  const videoID = useRouteMatch('/courses/course/:courseID/lesson/:lessonID/:videoID')?.params.videoID
  const courseUserAccess = userCourses.findIndex(x => x.courseID === courseID) > -1
  const history = useHistory()
  const { screenWidth } = useWindowDimensions()
  const [flag, setFlag] = useState(true)
 
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
    if(allCourseVideos.length && flag) {
      setPlayPosition(allCourseVideos.findIndex(x => x.split('/')[1] === videoID))
      setFlag(false)
    }
  },[videoID, allCourseVideos])

  useEffect(() => {
    if(courseID.length && lessonID.length && allCourseVideos.length) {
      history.push(`/courses/course/${courseID}/lesson/${allCourseVideos[playPosition]}`)
    }
  },[courseID, lessonID, playPosition])

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
          {
            courseUserAccess ? 
            <VideoEmbed 
              embedUrl={lesson.videoType === "youtube" ? `https://www.youtube.com/embed/${video?.url}` : video?.url}
            /> : ""
          }
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
        </div>
        { courseUserAccess ? <>
          <div className="lesson-text-contents">
            <h3 className="page-title">Lesson Material</h3>
            <div className='lesson-material'>
              {lessonNotesRender}
            </div>
          </div>
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
  )
}
