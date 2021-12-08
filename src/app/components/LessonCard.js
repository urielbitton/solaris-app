import React, { useEffect, useState } from 'react'
import { getVideosByLessonID } from '../services/courseServices'
import AppAccordion from './AppAccordion'
import './styles/LessonCard.css'
import VideoRow from './VideoRow'

export default function LessonCard(props) {

  const {courseID, keyword, activeLesson, courseUserAccess, createMode, tempVideos, 
    initComponent, deleteBtn} = props
  const {title, lessonID, lessonType} = props.lesson
  const [videos, setVideos] = useState([])
  const [openAccord, setOpenAccord] = useState(true)
  const clean = text => text.replace(/[^a-zA-Z0-9 ]/g, "")
  let pattern = new RegExp('\\b' + clean(keyword), 'i')

  const videosRender = createMode ? tempVideos : videos
  ?.filter(x => pattern.test(x.title))
  .map((video,i) => {
    return <VideoRow 
      video={video} 
      lessonType={lessonType} 
      courseID={courseID}
      lessonID={lessonID}
      courseUserAccess={courseUserAccess}
      key={i} 
    />
  })

  useEffect(() => {
    getVideosByLessonID(courseID, lessonID, setVideos)
  },[])

  return (
    <AppAccordion
      title={title}
      noPadding
      open={openAccord}
      setOpen={setOpenAccord}
      active={activeLesson}
      createMode={createMode}
      deleteBtn={deleteBtn}
    >
      <div className="lesson-container">{videosRender}</div>
      { createMode && initComponent }
    </AppAccordion>
  )
}
