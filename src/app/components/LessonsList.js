import React from 'react'
import LessonCard from './LessonCard'

export default function LessonsList({lessons, courseID}) {

  const lessonsRender = lessons?.map((lesson,i) => {
    return <LessonCard lesson={lesson} courseID={courseID} key={i} />
  })

  return (
    <section>
      <h3>Course Content</h3>
      {lessonsRender}
    </section>
  )
}
