import React from 'react'
import { cleanAnswer } from "../../utils/utilities"
import './styles/AnswerCard.css'

export default function AnswerCard(props) {

  const { answer, title, order, choices } = props.question
  const { userQuiz, index, editMode, correctedQuestions, setCorrectedQuestions } = props
  const isCorrect = !editMode ? cleanAnswer(answer) === cleanAnswer(userQuiz?.submission ? userQuiz?.submission[index] : '') :
    correctedQuestions[index]?.isCorrect
  
  const choicesList = choices?.map((choice,i) => {
    return <li>{choice}</li>
  })

  const markQuestion = () => {
    correctedQuestions[index] = {
      isCorrect: !isCorrect
    }
    setCorrectedQuestions(prev => [...prev]) 
  } 

  return (
    <div className={`answer-card ${isCorrect ? "correct" : ""}`}>
      <div className="header">
        <div>
          {
            isCorrect ?
            <i className="far fa-check"></i> :
            <i className="far fa-times"></i>
          }      
          <h5>{order}.</h5>  
          <p>{title}</p>
        </div>
        <span className="true-false">{isCorrect ? 'correct' : "wrong"}</span>
        { 
          editMode && 
          <small 
            className="mark-corrent"
            onClick={() => markQuestion()}
          >
            {isCorrect ? 'Mark Incorrect' : 'Mark Correct'}
          </small> 
        }
      </div>
      { choices?.length ?
        <details>
          <summary>Choices</summary>
          <ul>
            {choicesList}
          </ul>
        </details> :
        <></>
      }
      <div className="your-answer">
        <small>
          { editMode ? "Student Answer" : "Your Answer" } answer: &nbsp;
          <span>{userQuiz?.submission ? userQuiz?.submission[index] : ''}</span>
        </small>
      </div>
      <div className="correct-answer">
        <small>
          Correct answer: &nbsp;
          <span>{answer}</span>
        </small>
      </div>
    </div>
  )
}