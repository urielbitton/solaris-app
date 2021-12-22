import React, { useState } from 'react'
import LessonCard from './LessonCard'
import {AppInput} from '../ui/AppInputs'

export default function LessonsList(props) {

  const {lessons, courseID, title, showSearch, activeLesson, courseUserAccess, videoTitleLength,
    lessonsScrollRef} = props
  const [keyword, setKeyword] = useState('')

  const lessonsRender = lessons?.map((lesson,i) => {
    return <LessonCard 
      lesson={lesson} 
      courseID={courseID} 
      keyword={keyword}
      activeLesson={lesson.lessonID === activeLesson}
      courseUserAccess={courseUserAccess}
      videoTitleLength={videoTitleLength}
      key={i} 
    />
  })

  return (
    <section className="lessons-list">
      <div ref={lessonsScrollRef} className='lessons-anchor'/>
      <h3>{title}</h3>
      {
        showSearch &&
        <div className="lessons-search">
          <AppInput 
            placeholder="Search lessons..."
            iconclass="fal fa-search"
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      }
      {lessonsRender}
    </section>
  )
}
