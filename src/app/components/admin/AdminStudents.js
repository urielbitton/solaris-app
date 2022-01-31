import React, { useEffect, useState } from 'react'
import { getAllStudents } from "../../services/adminServices"
import StudentRow from "./StudentRow"
import './styles/Admin.css'

export default function AdminStudents() {

  const [allStudents, setAllStudents] = useState([])

  const allStudentsRender = allStudents?.map((student, i) => {
    return <StudentRow 
      student={student}
      key={i}
    />
  })

  useEffect(() => {
    getAllStudents(setAllStudents, 100)
  },[])

  return (
    <div className="admin-section admin-students">
      <section>
        <h4>Students</h4>
        <div className="table">
          <header>
            <h5>Name</h5>
            <h5 className="medium">Email</h5>
            <h5 className="medium">User ID</h5>
            <h5>City</h5>
            <h5>Country</h5>
            <h5>Date Joined</h5>
          </header>
          <div className="body">
            {allStudentsRender}
          </div>
        </div>
      </section>
    </div>
  )
}
