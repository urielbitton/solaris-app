import React, { useContext, useEffect, useState } from 'react'
import './styles/CreateQuiz.css'
import { StoreContext } from '../store/store'
import { useHistory, useLocation, useRouteMatch } from "react-router-dom"
import { quizTypes } from "../api/apis"
import { AppInput, AppSwitch, AppTextarea } from '../components/ui/AppInputs'
import { db } from "../firebase/fire"
import { setSubDB } from '../services/CrudDB'
import QuestionCard from "../components/quiz/QuestionCard"
import PageLoader from '../components/ui/PageLoader'
import { getQuestionsByQuizID, getQuizByID } from "../services/courseServices"

export default function CreateQuiz() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)
  const courseID = useRouteMatch('/courses/course/:courseID/create/quiz').params.courseID
  const quizID = useRouteMatch('/courses/course/:courseID/create/quiz/:quizID')?.params.quizID
  const [quizType, setQuizType] = useState('')
  const [quizName, setQuizName] = useState('')
  const [totalPoints, setTotalPoints] = useState(0)
  const [maxDuration, setMaxDuration] = useState(0)
  const [quizNotes, setQuizNotes] = useState('')
  const [isAvailable, setIsAvailable] = useState(true)
  const [questionTitle, setQuestionTitle] = useState('')
  const [questionsArr, setQuestionsArr] = useState([])
  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState({})
  const [questions, setQuestions] = useState([])
  const [showSaveBtn, setShowSaveBtn] = useState(false)
  const [editingIndex, setEditingIndex] = useState(-1)
  const [deletedQuestions, setDeletedQuestions] = useState([])
  const [hideInactive, setHideInactive] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const editMode = location.search.includes('edit=true')
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

  const questionsRender = questionsArr
  ?.sort((a,b) => a.order - b.order ? 1 : -1)
  .map((question, i) => {
    return <QuestionCard 
      question={question}
      questionsArr={questionsArr}
      setQuestionsArr={setQuestionsArr}
      index={i}
      editMode={editMode}
      showSaveBtn={showSaveBtn}
      setShowSaveBtn={setShowSaveBtn}
      editingIndex={editingIndex}
      setEditingIndex={setEditingIndex}
      deletedQuestions={deletedQuestions} 
      setDeletedQuestions={setDeletedQuestions}
      hideInactive={hideInactive}
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
        questionType: 'radio',
        order: questionsArr.length + 1,
        points: 1,
        questionID: newQuestionID,
        isRequired: true,
        isActive: true
      }])
    }
  }

  const createQuiz = () => {
    if(quizName.length && (questionsArr.length > deletedQuestions.length)) {
      setLoading(true)
      setSubDB('courses', courseID, 'quizes', !editMode ? newQuizID : quizID, {
        ...(!editMode && {dateCreated: new Date()}),
        maxDuration: +maxDuration,
        name: quizName,
        note: quizNotes,
        points: +totalPoints,
        quizID: !editMode ? newQuizID : quizID,
        quizType,
        isAvailable,
        numOfQuestions: questionsArr.length,
        ...(!editMode && {takenBy: []})
      }, true)
      .then(() => {
        const batch = db.batch()
        deletedQuestions.forEach(deleted => {
          const docRef = db.collection('courses').doc(courseID)
            .collection('quizes').doc(!editMode ? newQuizID : quizID)
            .collection('questions').doc(deleted.questionID)
          batch.delete(docRef)
        })
        questionsArr.forEach(question => {
          if(question.isActive) {
            const docRef = db.collection('courses').doc(courseID)
              .collection('quizes').doc(!editMode ? newQuizID : quizID)
              .collection('questions').doc(question.questionID)
            batch.set(docRef, {
              answer: question.answer,
              choices: question.choices,
              hint: question.hint,
              questionType: question.questionType,
              order: question.order,
              points: question.points,
              questionID: question.questionID,
              title: question.title,
              isRequired: question.isRequired,
              isActive: question.isActive
            }, {merge: true})
          }
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
      window.alert('Please fill in all quiz details. There must also be a minimum of 1 question on the quiz.')
    }
  }
  
  useEffect(() => {
    setNavTitle(`${!editMode ? 'Create' : 'Edit'} Quiz`)
    setNavDescript('')
  },[])

  useEffect(() => {
    getQuizByID(courseID, quizID, setQuiz)
  },[courseID])

  useEffect(() => {
    getQuestionsByQuizID(courseID, quizID, setQuestions)
  },[quizID])

  useEffect(() => {
    if(editMode) {
      setQuizType(quiz.quizType)
      setQuizName(quiz.name)
      setTotalPoints(quiz.points)
      setMaxDuration(quiz.maxDuration)
      setQuizNotes(quiz.note)
      setIsAvailable(quiz.isAvailable)
      setQuestionsArr(questions)
    }
  },[quiz, questions])

  return (
    <div className="create-quiz-page">
      <h3>{!editMode ? "Create a Quiz" : `Editing Quiz: ${quizName}`}</h3>
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
            value={quizName}
          />
          <AppInput 
            title="Total Points Worth" 
            type="number"
            onChange={(e) => setTotalPoints(e.target.value)}
            value={totalPoints}
          />
          <AppInput 
            title="Time Duration (in minutes)" 
            type="number"
            onChange={(e) => setMaxDuration(e.target.value)}
            value={maxDuration}
          />
          <AppTextarea 
            title="Quiz Notes"
            onChange={(e) => setQuizNotes(e.target.value)}
            value={quizNotes}
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
      {
        editMode ? 
        <small>*Don't forget to save your question edits</small> :
        ""
      }
      <AppSwitch 
        title="Hide Removed Questions"
        className="hide-inactive"
        onChange={(e) => setHideInactive(e.target.checked)}
        checked={hideInactive}
      />
      <section className="footer">
        <button 
          className="shadow-hover"
          onClick={() => createQuiz()} 
        >
            {editMode ? "Save" : "Create"} Quiz
        </button>
      </section>
      <PageLoader loading={loading} />
    </div>
  )
}
