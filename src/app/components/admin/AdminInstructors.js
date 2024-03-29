import React, { useEffect, useState } from 'react'
import { getAllInstructors } from '../../services/InstructorServices'
import InstructorRow from "./InstructorRow"

export default function AdminInstructors() {

  const [allInstructors, setAllInstructors] = useState([])

  const allInstructorsRender = allInstructors?.map((instructor, i) => {
    return <InstructorRow 
      instructor={instructor} 
      key={i} 
    />
  })

  useEffect(() => {
    getAllInstructors(setAllInstructors, 100)
  },[])

  return (
    <div className="admin-section admin-instructor">
      <section>
        <h4>All Instructors</h4>
        <div className="table">
          <header>
            <h5 className="medium">Instructor</h5>
            <h5 className="medium">Title</h5>
            <h5>Followers</h5>
            <h5>Courses Taught</h5>
            <h5>Reviews</h5>
            <h5>Ratings</h5>
            <h5>Date Joined</h5>
          </header>
          <div className="body">
            {allInstructorsRender}
          </div>
        </div>
      </section>
    </div>
  )
}
