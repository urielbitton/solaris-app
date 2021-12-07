import React from 'react'
import { useRouteMatch } from 'react-router'
import './styles/CreateCoursePage.css'

export default function CreateCoursePage() {

  const courseType = useRouteMatch('/create/create-course/:courseType').params.courseType

  return (
    <div className="create-course-page">
      Create course page: {courseType}
    </div>
  )
}
