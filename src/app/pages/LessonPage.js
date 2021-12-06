import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import LessonsList from '../components/LessonsList'
import WriteComment from '../components/WriteComment'
import { getCourseByID, getLessonByID, getLessonsByCourseID, getVideosByLessonID, ggetVideoByID } from '../services/courseServices'
import { StoreContext } from '../store/store'
import './styles/LessonPage.css'
import VideoEmbed from '../components/VideoEmbed'

export default function LessonPage(props) {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)
  const {} = props
  const [course, setCourse] = useState([])
  const [lessons, setLessons] = useState([])
  const [videos, setVideos] = useState([])
  const [lesson, setLesson] = useState({})
  const [video, setVideo] = useState({})
  const courseID = useRouteMatch('/courses/course/:courseID')?.params.courseID
  const lessonID = useRouteMatch('/courses/course/:courseID/lesson/:lessonID')?.params.lessonID
  const videoID = useRouteMatch('/courses/course/:courseID/lesson/:lessonID/:videoID')?.params.videoID

  useEffect(() => {
    getLessonsByCourseID(courseID, setLessons)
    getCourseByID(courseID, setCourse)
    getVideosByLessonID(courseID, lessonID, setVideos)
    getLessonByID(courseID, lessonID, setLesson)
    ggetVideoByID(courseID, lessonID, videoID, setVideo)
  },[courseID])

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
        />
      </div>
      <div className="lesson-content">
        <div className="lesson-video-container">
          <h3>{lesson.title}</h3>
          <h6><span>{videos.length}</span> video{videos.length !== 1 ? "s" : ""} in this lesson</h6>
          <VideoEmbed 
            videoWidth="90%"
            videoHeight="450"
            embedUrl={video.url}
          />
        </div>
        <div className="lesson-text-contents">
          
        </div>
        <div className="leave-reply-section">
          <WriteComment 
            courseID={courseID}
            writeType="comment"
            title="Leave a Reply"
            messageInput="Enter Reply"
          />
        </div>
      </div>
    </div>
  )
}
