import React, { useState } from 'react'
import { AppInput, AppSelect, AppSwitch } from "../ui/AppInputs"
import './styles/QuestionCard.css'
import TextareaAutosize from 'react-textarea-autosize'

export default function QuestionCard(props) {

  const { title } = props.question
  const [questionTitle, setQuestionTitle] = useState(title)
  const [questionType, setQuestionType] = useState('radio')
  const [isRequired, setIsRequired] = useState(true)
  const [optionText, setOptionText] = useState('')
  const [choices, setChoices] = useState([])
  const [editingChoice, setEditingChoice] = useState(-1)
  const [enterReminder, setEnterReminder] = useState(-1)

  const quizTypeOptions = [
    {name: 'Multiple Choice', value: 'radio'},
    {name: 'Checkboxes', value: 'checkbox'},
    {name: 'Short Answer', value: 'text'},
  ]

  const choicesRender = choices?.map((choice, i) => {
    return <div className="choice-row" key={i}>
      <input 
        type={questionType} 
        className="radio"
        disabled 
      />
      <AppInput 
        placeholder="Add option"
        onKeyPress={(e) => handleOptionPressEnter(e, true, i)}
        onChange={(e) => {
          setOptionText(e.target.value)
          setEnterReminder(i)
        }}
        onFocus={() => {
          setEditingChoice(i)
          setOptionText(choice)
        }}
        onBlur={() => {
          setEditingChoice(-1)
          setOptionText('')
        }}
        value={ editingChoice === i ? optionText : choice}
      />
      <small className={`enter-reminder ${ (enterReminder === i && editingChoice === i) ? "show" : "" }`}>
        Press enter to save
      </small>
      <div className="icon-container" onClick={() => deleteChoice(i)}>
        <i className="fal fa-times"></i>
      </div>
    </div>
  })

  const handleOptionPressEnter = (e, editing, index) => {
    if(e.key === 'Enter' && e.shiftKey) return
    else if(e.key === 'Enter') {
      e.preventDefault()
      setEnterReminder(-1)
      if(optionText.length) {
        if(!editing) {
          setChoices(prev => [...prev, optionText])
        }
        else {
          choices[index] = optionText
          setChoices(prev => [...prev])
          setEditingChoice(-1)
        }
        setOptionText('')
      }
    }
  }
  
  const deleteChoice = (index) => {
    choices.splice(index, 1)
    setChoices(prev => [...prev])
  }

  return (
    <div className="question-card">
      <header>
        <TextareaAutosize 
          placeholder="Question Title"
          onChange={(e) => setQuestionTitle(e.target.value)}
          value={questionTitle}
          maxRows={10}
          className="apptextarea commoninput"
        />
        <AppSelect 
          options={quizTypeOptions} 
          onChange={(e) => setQuestionType(e.target.value)}
        />
      </header>
      <section>
        <div className="choice-row">
          <input 
            type={questionType} 
            className="radio"
            disabled 
          />
          <AppInput 
            placeholder="Add option"
            onChange={(e) => setOptionText(e.target.value)}
            onKeyPress={(e) => handleOptionPressEnter(e)}
            onBlur={() => setOptionText('')}
            value={ editingChoice === -1 ? optionText : ''}
          />
        </div>
        {choicesRender}
      </section>
      <footer>
        <div className="icon-container">
          <i className="fal fa-clone"></i>
        </div>
        <div className="icon-container">
          <i className="fal fa-trash-alt"></i>
        </div>
        <div>
          <AppSwitch 
            title="Required"
            onChange={(e) => setIsRequired(e.target.checked)}
            checked={isRequired}
          />
        </div>
      </footer>
    </div>
  )
}
