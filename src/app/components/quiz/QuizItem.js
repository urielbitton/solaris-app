import React from 'react'
import './styles/QuizItem.css'
import { AppInput } from '../ui/AppInputs'

export default function QuizItem(props) {

  const { answer, choices, hint, questionType, points, questionID,
    title, order } = props.question
  const { userAnswers, setUserAnswers } = props
  const textTypeQuestion = questionType === 'radio' || questionType === 'checkbox'

  const choicesRender = choices?.map((choice, i) => {
    return <li key={i}>
      <AppInput 
        title={choice}
        type={questionType} 
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
          textTypeQuestion ? 
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
