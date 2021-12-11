import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import LessonsList from '../components/LessonsList'
import WriteComment from '../components/WriteComment'
import { getCourseByID, getLessonByID, getLessonsByCourseID, getVideosByLessonID, getVideoByID, getCommentsByVideoID } from '../services/courseServices'
import { StoreContext } from '../store/store'
import './styles/LessonPage.css'
import VideoEmbed from '../components/VideoEmbed'
import Showdown from 'showdown'
import CommentCard from '../components/CommentCard'
import { getCoursesIDEnrolledByUserID } from '../services/userServices'
import lockedImg from '../assets/imgs/locked-content.png'

export default function LessonPage(props) {

  const {setNavTitle, setNavDescript, user} = useContext(StoreContext)
  const {} = props
  const [course, setCourse] = useState([])
  const [lessons, setLessons] = useState([])
  const [videos, setVideos] = useState([])
  const [lesson, setLesson] = useState({})
  const [video, setVideo] = useState({})
  const [comments, setComments] = useState([])
  const [userCourses, setUserCourses] = useState([])
  const courseID = useRouteMatch('/courses/course/:courseID')?.params.courseID
  const lessonID = useRouteMatch('/courses/course/:courseID/lesson/:lessonID')?.params.lessonID
  const videoID = useRouteMatch('/courses/course/:courseID/lesson/:lessonID/:videoID')?.params.videoID
  const courseUserAccess = userCourses.findIndex(x => x.courseID === courseID) > -1
  const history = useHistory()

  const commentsRender = comments?.map((comment,i) => {
    return <CommentCard comment={comment} key={i} type="comment" />
  })

  useEffect(() => {
    getLessonsByCourseID(courseID, setLessons)
    getCourseByID(courseID, setCourse)
    getVideosByLessonID(courseID, lessonID, setVideos)
  },[courseID])

  useEffect(() => {
    getLessonByID(courseID, lessonID, setLesson)
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
    setNavDescript(course.title)
  },[course])

  return (
    <div className="lesson-page">
      <div className="lesson-sidebar hidescroll">
        <LessonsList 
          lessons={lessons} 
          courseID={courseID} 
          showSearch
          activeLesson={lessonID}
          courseUserAccess={courseUserAccess}
        />
      </div>
      <div className="lesson-content">
        { courseUserAccess ? <>
          <div className="lesson-video-container">
            <div className='title-row'>
              <h3>{lesson.title}</h3>
              <button onClick={() => history.push(`/courses/course/${courseID}`)}><i className='fal fa-arrow-left'></i>Back to Course</button>
            </div>
            <h6><span>{videos.length}</span> video{videos.length !== 1 ? "s" : ""} in this lesson</h6>
            <VideoEmbed 
              videoWidth="90%"
              videoHeight="450"
              embedUrl={lesson.videoType === "youtube" ? `https://www.youtube.com/embed/${video.url}` : video.url}
            />
          </div>
          <div className="lesson-text-contents">
            <h3 className="page-title">Lesson Material</h3>
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
              writeType="comment"
              title="Leave a Reply"
              messageInput="Enter Reply"
            />
          </div></> :
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
