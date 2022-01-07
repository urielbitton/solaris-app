import React, { useContext, useEffect, useState } from 'react'
import './styles/CreateQuiz.css'
import { StoreContext } from '../store/store'
import { useHistory, useRouteMatch } from "react-router-dom/cjs/react-router-dom.min"
import { quizTypes } from "../api/apis"
import { AppInput, AppSwitch, AppTextarea } from '../components/ui/AppInputs'
import { db } from "../firebase/fire"
import { setSubDB } from '../services/CrudDB'
import QuestionCard from "../components/quiz/QuestionCard"
import PageLoader from '../components/ui/PageLoader'

export default function CreateQuiz() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)
  const courseID = useRouteMatch('/courses/course/:courseID/create/quiz').params.courseID
  const [quizType, setQuizType] = useState('')
  const [quizName, setQuizName] = useState('')
  const [totalPoints, setTotalPoints] = useState(0)
  const [maxDuration, setMaxDuration] = useState(0)
  const [quizNotes, setQuizNotes] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [questionTitle, setQuestionTitle] = useState('')
  const [questionsArr, setQuestionsArr] = useState([])
  const [loading, setLoading] = useState(false)
  const newQuizID = db.collection('courses').doc(courseID).collection('quizes').doc().id
  const history = useHistory()

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
        isRequired: true
      }])
    }
  }

  const createQuiz = () => {
    if(quizName.length && questionsArr.length) {
      setLoading(true)
      setSubDB('courses', courseID, 'quizes', newQuizID, {
        dateCreated: new Date(),
        maxDuration: +maxDuration,
        name: quizName,
        note: quizNotes,
        points: +totalPoints,
        quizID: newQuizID,
        quizType,
        isAvailable,
        takenBy: []
      })
      .then(() => {
        const batch = db.batch()
        questionsArr.forEach(question => {
          const docRef = db.collection('courses').doc(courseID)
            .collection('quizes').doc(newQuizID)
            .collection('questions').doc(question.questionID)
          batch.set(docRef, {
            answer: question.answer,
            choices: question.choices,
            hint: question.hint,
            multipleAnswers: question.multipleAnswers,
            multipleChoice: question.multipleChoice,
            order: question.order,
            points: question.points,
            questionID: question.questionID,
            title: question.title,
            isRequired: question.isRequired
          })
        })
        batch.commit()
        .then(() => {
          setLoading(false)
          history.push(`/courses/course/${courseID}?goto=scrollToQuizes`)
        })
        .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
    }
    else {
      window.alert('Please fill in all quiz details')
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
          <AppInput 
            title="Quiz Name"
            onChange={(e) => setQuizName(e.target.value)}
          />
          <AppInput 
            title="Total Points Worth" 
            type="number"
            onChange={(e) => setTotalPoints(e.target.value)}
          />
          <AppInput 
            title="Time Duration (in minutes)" 
            type="number"
            onChange={(e) => setMaxDuration(e.target.value)}
          />
          <AppTextarea 
            title="Quiz Notes"
            onChange={(e) => setQuizNotes(e.target.value)}
          />
          <AppSwitch 
            title="Active"
            onChange={(e) => setIsAvailable(e.target.checked)}
            checked={isAvailable}
          />
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
            <div className="btns-row">
              <button 
                className="shadow-hover"
                onClick={() => addQuestion()}
              >
                Add
                <i className="fal fa-plus-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="footer">
        <button 
          className="shadow-hover"
          onClick={() => createQuiz()}
        >
            Create Quiz
        </button>
      </section>
      <PageLoader loading={loading} />
    </div>
  )
}
