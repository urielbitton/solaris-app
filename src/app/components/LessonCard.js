import React, { useEffect, useState } from 'react'
import { getVideosByLessonID } from '../services/courseServices'
import AppAccordion from './AppAccordion'
import LessonNotesRow from './LessonNotesRow'
import './styles/LessonCard.css'
import VideoRow from './VideoRow'

export default function LessonCard(props) {

  const {courseID, keyword, activeLesson, courseUserAccess, createMode, addedVideos=[], 
    initComponent, deleteBtn, notOpenVideoPage, notes, files, onVideoClick, onNotesClick,
    videoTitleLength, maxAccordionHeight, editMode} = props
  const {title, lessonID, lessonType} = props.lesson
  const [videos, setVideos] = useState([])
  const [openAccord, setOpenAccord] = useState(true)
  const clean = text => text.replace(/[^a-zA-Z0-9 ]/g, "")
  let pattern = new RegExp('\\b' + clean(keyword), 'i')

  const videosRender = [...videos, ...addedVideos]
  ?.filter(x => pattern.test(x.title))
  .map((video,i) => {
    return <VideoRow 
      video={video} 
      lessonType={lessonType} 
      courseID={courseID}
      lessonID={lessonID}
      courseUserAccess={courseUserAccess}
      videoTitleLength={videoTitleLength}
      notOpenVideoPage={notOpenVideoPage}
      onVideoClick={() => onVideoClick(video)}
      key={i} 
    />
  })

  const editVideosRender = addedVideos.map((video,i) => {
    return <VideoRow 
      video={video} 
      lessonType={lessonType} 
      courseID={courseID}
      lessonID={lessonID}
      courseUserAccess={courseUserAccess}
      videoTitleLength={videoTitleLength}
      notOpenVideoPage={notOpenVideoPage}
      onVideoClick={() => onVideoClick(video)}
      key={i} 
    />
  })

  const notesRender = notes?.map((note,i) => {
    return <LessonNotesRow 
      note={note}
      files={files}
      onNotesClick={() => onNotesClick(note)}
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
      headerMetaTitle={'Lesson: ' + title}
      maxAccordionHeight={maxAccordionHeight}
    >
      <div className="lesson-container">
        { !editMode ? [videosRender, notesRender] : [editVideosRender, notesRender]}
      </div>
      { createMode && initComponent }
    </AppAccordion>
  )
}
