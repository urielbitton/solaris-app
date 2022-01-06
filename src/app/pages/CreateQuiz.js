import React, { useContext, useEffect, useState } from 'react'
import './styles/CreateQuiz.css'
import { StoreContext } from '../store/store'
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom.min"
import { quizTypes } from "../api/apis"
import { AppInput, AppTextarea } from '../components/ui/AppInputs'
import { db } from "../firebase/fire"
import QuestionCard from "../components/quiz/QuestionCard"

export default function CreateQuiz() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)
  const courseID = useRouteMatch('/courses/course/:courseID/create/quiz').params.courseID
  const [quizType, setQuizType] = useState('')
  const [questionTitle, setQuestionTitle] = useState('')
  const [questionsArr, setQuestionsArr] = useState([])
  const newQuizID = db.collection('courses').doc(courseID).collection('quizes').doc().id

  const quizypesRender = quizTypes?.map((type,i) => {
    return <div 
      className={`type-box ${quizType === type.value ? "active" : ""}`} 
      onClick={() => setQuizType(type.value)}
      key={i} 
    >
      <i className={`${type.icon} main-icon turn-blue`}></i>
      <h4 className="turn-blue">{type.name}</h4>
      <small className="turn-blue">{type.subName}</small>
      <i className="fas fa-check-circle check-icon"></i>
    </div>
  })

  const questionsRender = questionsArr?.map((question, i) => {
    return <QuestionCard 
      question={question}
      questionsArr={questionsArr}
      setQuestionsArr={setQuestionsArr}
      index={i}
      key={i} 
    />
  })
  console.log(questionsArr)
  const handlePressEnter = (e) => {
    if(e.key === 'Enter' && e.shiftKey) return
    else if(e.key === 'Enter') {
      e.preventDefault()
      setQuestionTitle('')
      addQuestion()
    }
  }

  const addQuestion = () => {
    if(questionTitle.length) {
      const newQuestionID = db.collection('courses').doc(courseID)
        .collection('quizes').doc(newQuizID)
        .collection('questions').doc().id
      setQuestionsArr(prev => [...prev, {
        title: questionTitle,
        answer: '',
        choices: [],
        hint: '',
        multipleAnswers: false,
        multipleChoice: true,
        order: questionsArr.length + 1,
        points: 1,
        questionID: newQuestionID,
        required: true
      }])
    }
  }

  useEffect(() => {
    setNavTitle('Create Quiz')
    setNavDescript('')
  },[])

  return (
    <div className="create-quiz-page">
      <h3>Create a Quiz</h3>
      <section>
        <div className="header">
          <h3>Quiz Type</h3>
        </div>
        <div className="quiz-types-container">
          {quizypesRender}
        </div>
      </section>
      <section>
        <div className="header">
          <h3>Quiz Info</h3>
        </div>
        <div className="quiz-info-inputs">
          <AppInput title="Quiz Name"/>
          <AppInput title="Total Points Worth" type="number"/>
          <AppInput title="Time Duration (in minutes)" type="number"/>
          <AppTextarea title="Quiz Notes"/>
        </div>
      </section>
      <section>
        <div className="header">
          <h3>Questions</h3>
        </div>
        <div className="quiz-questions">
          <div className="quiz-questions-container">
            {questionsRender}
          </div>
          <div className="question-generator">
            <AppTextarea 
              placeholder="Quiz title...(hit enter to add)"
              onChange={(e) => setQuestionTitle(e.target.value)}
              onKeyPress={(e) => handlePressEnter(e)}
              value={questionTitle}
            />
            <button 
              className="shadow-hover"
              onClick={() => addQuestion()}
            >
              Add
              <i className="fal fa-plus-circle"></i>
            </button>
          </div>
        </div>
      </section>
      <section className="footer">
        <button className="shadow-hover">Create Quiz</button>
      </section>
    </div>
  )
}
