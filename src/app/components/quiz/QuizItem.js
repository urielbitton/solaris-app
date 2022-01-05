import React from 'react'
import './styles/QuizItem.css'
import { AppInput } from '../ui/AppInputs'

export default function QuizItem(props) {

  const { answer, choices, hint, multipleChoice, points, questionID,
    title, order, multipleAnswers } = props.question
  const { userAnswers, setUserAnswers } = props

  const choicesRender = choices?.map((choice, i) => {
    return <li key={i}>
      <AppInput 
        title={choice}
        type={!multipleAnswers ? "radio" : "checkbox"} 
        onChange={(e) => addAnswer(e)}
        value={choice}
        name={questionID}
      />
    </li>
  })

  const addAnswer = (e) => {
    userAnswers[order-1] = e.target.value
    setUserAnswers(prev => [...prev])
  }

  return (
    <div className="quiz-item">
      <header>
        <h4>{order}.&emsp;{title}</h4>
      </header>
      <section className="answer-section">
        {
          multipleChoice ? 
          <ul className="multiple-choice">
            {choicesRender}
          </ul> :
          <div className="short-answer">
            <textarea 
              placeholder="Answer here..." 
              onChange={(e) => addAnswer(e)}
            />
          </div>
        }
      </section>
    </div>
  )
}
