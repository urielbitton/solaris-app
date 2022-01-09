import React, { useState, useEffect } from 'react'
import { AppInput, AppSelect, AppSwitch, AppTextarea } from "../ui/AppInputs"
import './styles/QuestionCard.css'
import TextareaAutosize from 'react-textarea-autosize'

export default function QuestionCard(props) {

  const { title } = props.question
  const { questionsArr, setQuestionsArr, index, editMode, showSaveBtn, setShowSaveBtn,
    editingIndex, setEditingIndex } = props
  const [questionTitle, setQuestionTitle] = useState(title)
  const [questionType, setQuestionType] = useState('radio')
  const [isRequired, setIsRequired] = useState(true)
  const [optionText, setOptionText] = useState('')
  const [choices, setChoices] = useState([])
  const [editingChoice, setEditingChoice] = useState(-1)
  const [enterReminder, setEnterReminder] = useState(-1)
  const [optionPlaceholder, setOptionPlaceholder] = useState('Add option')
  const [answerText, setAnswerText] = useState('')
  const [hasAnswer, setHasAnswer] = useState(false)
  const [pointsWorth, setPointsWorth] = useState(1)
  const disableAddOptions = optionPlaceholder !== 'Add option'
  const textTypeQuestion = questionType === 'radio' || questionType === 'checkbox'
  const currentQuestion = questionsArr[index]
    

  const quizTypeOptions = [
    {name: 'Multiple Choice', value: 'radio'},
    {name: 'Checkboxes', value: 'checkbox'},
    {name: 'Short Answer', value: 'shortText'},
    {name: 'Long Answer', value: 'longText'},
  ]

  const choicesRender = choices?.map((choice, i) => {
    return <div className="choice-row" key={i}>
      <input 
        type={questionType} 
        className="q-type"
        style={{display: textTypeQuestion ? "block" : "none"}}
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
      <div 
        className="icon-container" 
        onClick={() => deleteChoice(i)}
      >
        <i className="fal fa-times" title="Remove"></i>
      </div>
    </div>
  })

  const handleOptionPressEnter = (e, editing, index) => {
    if(e.key === 'Enter' && e.shiftKey) return
    else if(e.key === 'Enter' && !disableAddOptions) {
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

  const fillInQuestion = () => {
    questionsArr[index] = {
      title: questionTitle,
      answer: answerText,
      choices: textTypeQuestion ? choices : [],
      isRequired,
      questionType,
      hint: '',
      order: index + 1,
      points: +pointsWorth,
      questionID: `question-${index}`
    }
    setQuestionsArr(prev => [...prev])
  }

  const saveQuestion = () => {
    questionsArr[index] = {
      title: questionTitle,
      answer: answerText,
      choices: textTypeQuestion ? choices : [],
      isRequired,
      questionType,
      hint: '',
      order: index + 1,
      points: +pointsWorth,
      questionID: `question-${index}`
    }
    setQuestionsArr(prev => [...prev])
    setShowSaveBtn(false)
  }
 
  const deleteQuestion = () => {
    const confirm = window.confirm('Are you sure you want to delete this question?')
    if(confirm) {
      setAnswerText('')
      setChoices([])
      setIsRequired(true)
      setPointsWorth(1)
      setQuestionType('radio')
      setQuestionTitle('')
      questionsArr.splice(index, 1)
      setQuestionsArr(prev => [...prev])
    }
  }

  const cloneQuestion = () => {
    questionsArr.push(questionsArr[index])
    setQuestionsArr(prev => [...prev])
  }
  
  useEffect(() => {
    if(questionType === 'shortText')
      setOptionPlaceholder('Short answer text')
    else if(questionType === 'longText')
      setOptionPlaceholder('Long answer text')
    else 
      setOptionPlaceholder('Add option')
  },[questionType])

  useEffect(() => {
    !editMode && fillInQuestion()
  },[questionTitle, questionType, choices, isRequired, answerText, pointsWorth])

  useEffect(() => {
    if(editMode) {
      setAnswerText(questionsArr[index].answer)
      setChoices(questionsArr[index].choices)
      setIsRequired(questionsArr[index].isRequired)
      setPointsWorth(questionsArr[index].points)
      setQuestionType(questionsArr[index].questionType)
      setQuestionTitle(questionsArr[index].title)
    }
  },[editMode])

  useEffect(() => {
    if(editMode) {
      setShowSaveBtn(
        currentQuestion.title !== questionTitle ||
        currentQuestion.choices !== choices || 
        currentQuestion.questionType !== questionType ||
        currentQuestion.isRequired !== isRequired ||
        currentQuestion.answer !== answerText ||
        currentQuestion.points !== pointsWorth
      )
      setEditingIndex(index)
    }
  },[questionsArr, questionTitle, questionType, choices, isRequired, answerText, pointsWorth])


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
          value={questionType}
          namebased
        />
      </header>
      <section>
        <div className="choice-row">
          <input 
            type={questionType} 
            className="q-type"
            style={{display: textTypeQuestion ? "block" : "none"}}
            disabled 
          />
          <AppInput 
            placeholder={optionPlaceholder}
            onChange={(e) => setOptionText(e.target.value)}
            onKeyPress={(e) => handleOptionPressEnter(e)}
            onBlur={() => setOptionText('')}
            value={ editingChoice === -1 ? optionText : ''}
            disabled={ disableAddOptions }
          />
        </div>
        { textTypeQuestion && choicesRender }
        <div className="answer-row">
          <small 
            className="add-answer-text" 
            onClick={() => setHasAnswer(prev => !prev)}
          >
            { hasAnswer ? "Hide Answer" : "Add Answer" }
          </small>
          {
            hasAnswer ?
            <AppTextarea 
              placeholder="Add an answer"
              onChange={(e) => setAnswerText(e.target.value)}
              value={answerText}
            />
            : ""
          }
        </div>
      </section>
      <footer>
        <div className="side">
          { editMode && showSaveBtn && editingIndex === index?
            <button 
              className="save-card-btn"
              onClick={() => saveQuestion()}
            >
              Save
            </button>
            : ""
          }
        </div>
        <div className="side">
          <div 
            className="icon-container" 
            onClick={() => cloneQuestion()}
          >
            <i className="fal fa-clone" title="Clone Question"></i>
          </div>
          <div 
            className="icon-container" 
            onClick={() => deleteQuestion()}
          >
            <i className="fal fa-trash-alt" title="Delete Question"></i>
          </div>
          <div>
            <AppInput 
              title="Points"
              onChange={(e) => setPointsWorth(e.target.value)}
              value={pointsWorth < 1 ? 1 : pointsWorth}
              className="points-worth"
              type="number"
              min={1}
            />
          </div>
          <div>
            <AppSwitch 
              title="Required"
              onChange={(e) => setIsRequired(e.target.checked)}
              checked={isRequired}
            />
          </div>
        </div>
      </footer>
    </div>
  )
}
