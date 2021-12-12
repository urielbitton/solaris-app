import React from 'react'
import CourseCard from './CourseCard'

export default function CoursesGrid({courses}) {

  const coursesRender = courses?.map((course,i) => {
    return <CourseCard course={course} ley={i} />
  })

  return (
    <div 
      className="courses-grid-container"
      style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gridGap: '20px'}}
    >
      {coursesRender}
    </div>
  )
}
