import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { getQuestionsByQuizID } from "../../services/courseServices"
import './styles/QuizCard.css'

export default function QuizCard(props) {

  const { courseID, isCourseInstructor } = props
  const { name, quizID, note } = props.quiz
  const [questions, setQuestions] = useState([])
  const history = useHistory()

  useEffect(() => {
    getQuestionsByQuizID(courseID, quizID, setQuestions)
  },[])

  return (
    <div className="quiz-card">
      <div>
        <h4><i className="far fa-align-center"></i>{name}</h4>
        <div className="quiz-info">
          <i className="far fa-info-circle"></i>
          <div className="tooltip">
            <p>{note}</p>
          </div>
        </div>
      </div>
      <div className="right">
        {
          isCourseInstructor ? 
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
        {
          isCourseInstructor ? 
          <button 
            onClick={() => history.push(`/courses/course/${courseID}/create/quiz/${quizID}?edit=true`)}
            className="mobile-edit-btn shadow-hover"
          >
            Edit Quiz
          </button> 
          : ""
        }
        <button 
          className="shadow-hover"
          onClick={() => history.push(`/courses/${courseID}/quiz/${quizID}`)}
        >Take Quiz</button>
      </div>
    </div>
  )
}
