import React, { useContext, useEffect, useState } from 'react'
import InstructorCard from '../components/InstructorCard'
import { getAllInstructors } from '../services/InstructorServices'
import { getInstructorsCount } from '../services/adminServices'
import { StoreContext } from '../store/store'
import './styles/Instructors.css'
import PageSearch from '../components/PageSearch'

export default function Instructors() {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)
  const [instructors, setInstructors] = useState([])
  const [instructorsCount, setInstructorsCount] = useState(0)
  const [limit, setLimit] = useState(10)

  const instructorsRender = instructors?.map((instructor,i) => {
    return <InstructorCard instructor={instructor} key={i} />
  })

  useEffect(() => {
    getAllInstructors(setInstructors, limit)
    getInstructorsCount(setInstructorsCount)
  },[])

  useEffect(() => {
    setNavTitle('Instructors')
    setNavDescript(instructorsCount + ' instructors on Solaris')
  },[instructorsCount])

  return (
    <div className="instructors-page">
      <section>
        <PageSearch 
          title="Find An Instructor"
          description="Search by instructor ID, name or job title"
        />
      </section>
      <h3>Instructors</h3>
      <div className="instructors-grid">
        {instructorsRender}
      </div>
    </div>
  )
}
