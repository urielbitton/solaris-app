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

  const markQuestion = (mark) => {
    correctedQuestions[index] = {
      isCorrect: mark,
      manuallyGraded: true
    }
    setCorrectedQuestions(prev => [...prev]) 
  } 

  return (
    <div className={`answer-card ${isCorrect ? "correct" : ""}`}>
      <div className="header">
        <div>
          { 
            correctedQuestions[order-1]?.manuallyGraded ?
            <i 
              className="fas fa-exclamation-triangle"
              title="Manually graded - save review to modify student score"
            ></i> :
            isCorrect ?
            <i className="far fa-check"></i> :
            <i className="far fa-times"></i>
          }      
          <h5>{order}.</h5>  
          <p>{title}</p>
        </div>
        <span 
          className={`true-false ${correctedQuestions[order-1]?.manuallyGraded ? 'manual-grade' : ''}`}
          title={correctedQuestions[order-1]?.manuallyGraded && `Manually graded as ${correctedQuestions[order-1]?.isCorrect ? 'Correct' : 'Incorrect'}`}
        >
          { correctedQuestions[order-1]?.manuallyGraded ? 'Manual Grade' : isCorrect ? 'correct' : "wrong"}
        </span>
        { 
          editMode && 
          <div className="mark-correct">
            <small onClick={() => markQuestion(true)}>
              Mark Correct
            </small> 
            <small onClick={() => markQuestion(false)}>
              Mark Incorrect
            </small> 
          </div>
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
          { editMode ? "Student Answer" : "Your Answer" }: &nbsp;
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