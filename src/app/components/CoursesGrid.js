import React from 'react'
import CourseCard from './CourseCard'
import { courseSorting } from '../utils/utilities'
import SkeletonLoader from './SkeletonLoader'

export default function CoursesGrid({courses, courseSort}) {

  const coursesRender = courses
  ?.sort((a,b) => courseSorting(a, b, courseSort))
  .map((course,i) => {
    return <CourseCard course={course} key={i} />
  })

  return (
    <div 
      className="courses-grid-container"
      style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gridGap: '20px'}}
    >
      { 
        courses.length ? 
        coursesRender :
        <SkeletonLoader width="300px" height="270px" amount={3} />
      }
    </div>
  )
}
