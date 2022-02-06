import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../store/store'
import { getInstructorByID } from '../../services/InstructorServices'
import { getStudentsByCourseID } from "../../services/courseServices"
import { convertFireDateToString, truncateText } from '../../utils/utilities'
import Ratings from '../ui/Ratings'
import { Link } from "react-router-dom"
import { updateDB } from '../../services/CrudDB'
import { useHistory } from "react-router-dom"

export default function CourseRow(props) {

  const { currencyFormat } = useContext(StoreContext)
  const { id, title, price, featuredCourse, instructorID, rating, dateCreated } = props.course
  const [featured, setFeatured] = useState(false)
  const [instructor, setInstructor] = useState({})
  const [students, setStudents] = useState([])
  const history = useHistory()

  const studentsRender = students?.map((student, i) => {
    return '\n'+student.name
  })

  const makeFeatured = (e) => {
    setFeatured(e.target.checked)
    updateDB('courses', id, {
      featuredCourse: e.target.checked
    })
  }

  useEffect(() => {
    setFeatured(featuredCourse)
    getInstructorByID(instructorID, setInstructor)
    getStudentsByCourseID(id, setStudents, Infinity)
  },[])

  return (
    <div className="admin-row course-row">
      <h6 title={title} className="long">
        <Link to={`/courses/course/${id}`}>{truncateText(title, 45)}</Link>
        <i className="fal fa-pen" onClick={() => history.push(`/edit-course/${id}`)}></i>
      </h6>
      <h6>{price === 0 ? 'Free' : currencyFormat.format(price)}</h6>
      <h6>{instructor?.name}</h6>
      <h6 title={studentsRender}>{students?.length}</h6>
      <Ratings 
        rating={rating} 
        ratingNumber
      />
      <h6>{convertFireDateToString(dateCreated)}</h6>
      <input 
        type="checkbox" 
        onChange={(e) => makeFeatured(e)}
        checked={featured}
      />
    </div>
  )
}
