import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { getQuestionsByQuizID } from "../../services/courseServices"
import './styles/QuizCard.css'

export default function QuizCard(props) {

  const { name, quizID, note } = props.quiz
  const { courseID, inCourseInstructor } = props
  const [questions, setQuestions] = useState([])
  const history = useHistory()

  useEffect(() => {
    getQuestionsByQuizID(courseID, quizID, setQuestions)
  },[])

  return (
    <div className="quiz-card">
      <div>
        <i className="far fa-align-center"></i>
        <h4>{name}</h4>
        <div className="quiz-info">
          <i className="far fa-info-circle"></i>
          <div className="tooltip">
            <p>{note}</p>
          </div>
        </div>
      </div>
      <div className="right">
        {
          inCourseInstructor ? 
          <div 
            className="icon-container"
            onClick={() => history.push(`/courses/course/${courseID}/create/quiz/${quizID}?edit=true`)}
            title="Edit Quiz"
          >
            <i className="fal fa-edit"></i>
          </div>
          : ""
        }
        <small>{questions.length} question{ questions.length !== 1 ? "s" : "" }</small>
        <button 
          className="shadow-hover"
          onClick={() => history.push(`/courses/${courseID}/quiz/${quizID}`)}
        >Take Quiz</button>
      </div>
    </div>
  )
}
