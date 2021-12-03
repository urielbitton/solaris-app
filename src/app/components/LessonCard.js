import React, { useEffect, useState } from 'react'
import { getVideosByLessonID } from '../services/courseServices'
import AppAccordion from './AppAccordion'
import './styles/LessonCard.css'
import VideoRow from './VideoRow'

export default function LessonCard(props) {

  const {courseID} = props
  const {title, lessonID, lessonType} = props.lesson
  const [videos, setVideos] = useState([])
  const [openAccord, setOpenAccord] = useState(true)

  const videosRender = videos?.map((video,i) => {
    return <VideoRow 
      video={video} 
      lessonType={lessonType} 
      courseID={courseID}
      lessonID={lessonID}
      key={i} 
    />
  })

  useEffect(() => {
    getVideosByLessonID(courseID, lessonID, setVideos)
  },[])

  return (
    <AppAccordion
      title={title}
      
      open={openAccord}
      setOpen={setOpenAccord}
    >
      <div className="lesson-container">{videosRender}</div>
    </AppAccordion>
  )
}
