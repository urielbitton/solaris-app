import React from 'react'
import CourseCard from './CourseCard'
import { courseSorting } from '../../utils/utilities'
import SkeletonLoader from '../ui/SkeletonLoader'

export default function CoursesGrid({courses, noskeleton}) {

  const coursesRender = courses?.map((course,i) => {
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
        noskeleton ?
        <SkeletonLoader width="300px" height="270px" amount={3} /> :
        <></>
      }
    </div>
  )
}
