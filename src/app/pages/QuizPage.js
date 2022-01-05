import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from "react-router-dom"
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min"
import QuizItem from "../components/quiz/QuizItem"
import { getQuestionsByQuizID, getQuizByID } from "../services/courseServices"
import { getUserQuizByID } from "../services/userServices"
import { StoreContext } from "../store/store"
import { msToTime } from "../utils/utilities"
import './styles/QuizPage.css'
import quizImg from '../assets/imgs/quiz-img.png'
import { updateSubDB } from '../services/CrudDB'
import PageLoader from '../components/ui/PageLoader'

export default function QuizPage() {

  const { setNavTitle, setNavDescript, user } = useContext(StoreContext)
  const courseID = useRouteMatch('/courses/:courseID/quiz/:quizID').params.courseID
  const quizID = useRouteMatch('/courses/:courseID/quiz/:quizID').params.quizID
  const [quiz, setQuiz] = useState({})
  const [questions, setQuestions] = useState([])
  const [timer, setTimer] = useState(0)
  const [startTimer, setStartTimer] = useState(false)
  const [userQuiz, setUserQuiz] = useState({})
  const [userAnswers, setUserAnswers] = useState([])
  const [loading, setLoading] = useState(false)
  const alreadyTaken = userQuiz.status === 'taken'
  const history = useHistory()
  const location = useLocation()
  const timeSinceStarted = Date.now() - (userQuiz?.takenOn?.seconds * 1000)
  const stillTimeLeft = timeSinceStarted < (quiz.maxDuration * 60000)
  const timeExpired = timeSinceStarted > (quiz.maxDuration * 60000)

  const questionsRender = questions?.map((question, i) => {
    return <QuizItem 
      question={question} 
      userAnswers={userAnswers}
      setUserAnswers={setUserAnswers}
      key={i} 
    />
  })

  const initiateTimer = () => {
    setStartTimer(true)
    updateSubDB('users', user?.uid, 'quizes', quizID, {
      status: 'in-progress',
      takenOn: new Date()
    })
  }

  const submitQuiz = () => {
    setLoading(true)
    updateSubDB('users', user?.uid, 'quizes', quizID, {
      status: 'taken',
      completedOn: new Date(),
      minutesTaken: +timer / 60_000,
      submission: userAnswers
    }).then(() => {
      setLoading(false)
      history.push({
        pathname: `/courses/${courseID}/quiz/${quizID}/results`,
        search: "?status=taken"
      })
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {
    getQuizByID(courseID, quizID, setQuiz)
    getQuestionsByQuizID(courseID, quizID, setQuestions)
    getUserQuizByID(user?.uid, quizID, setUserQuiz)
  },[courseID])

  useEffect(() => {
    let stopTimer
    if(startTimer) {
      history.push({
        search: `?status=in-progress` 
      })
      stopTimer = setInterval(() => {
        setTimer(prev => prev + 1000)
      },1000)
      return () => {
        clearInterval(stopTimer)
      }
    }
  },[startTimer])

  useEffect(() => {
    setTimer(timeSinceStarted)
  },[userQuiz])

  useEffect(() => {
    if(location.search === '?status=in-progress' && stillTimeLeft) {
      setStartTimer(true)
    }
    else {
      setStartTimer(false)
    }
  },[stillTimeLeft])
  
  useEffect(() => {
    if(timeExpired && !alreadyTaken) {
      submitQuiz()
    }
  },[timeSinceStarted])

  useEffect(() => {
    if(userQuiz.status === 'not-taken') {
      history.push({
        search: `?status=not-taken` 
      })
      setStartTimer(false)
      setTimer(0)
    }
  },[userQuiz])

  useEffect(() => {
    setNavTitle('Quiz')
    setNavDescript(quiz.name)
  },[quiz])

  return (
    <div className="quiz-page">
      <div className="quiz-banner">
        <div className="left">
          <h3>{quiz.name}</h3>
          <h5>Total time allowed: <span>{quiz.maxDuration} minutes</span></h5>
          <h5>Question{ questions.length !== 1 ? "s" : "" } in total: <span>{questions.length}</span></h5>
          <h5>Total points worth: <span>{quiz.points}</span></h5>
          <h5>Each question worth: <span>{quiz.points / questions.length}</span></h5>
        </div>
        <div className="icon-container">
          <i className="far fa-align-center"></i>
        </div>
      </div>
      {
        startTimer && !alreadyTaken ? 
        <div className="timer-container">
          <span>
            <i className="far fa-stopwatch"></i>
            {msToTime((quiz.maxDuration * 60000) - timer)}
          </span>
        </div> : ""
      }
      { 
        !alreadyTaken ?
        <>
          { userQuiz.status !== 'in-progress' ?
            <div className="start-container">
              <span>Once you hit start, a {quiz.maxDuration} minute timer will start</span>
              <button 
                className="start-quiz-btn shadow-hover" 
                onClick={() => initiateTimer()}
              >
                Start Quiz
                <i className="fal fa-arrow-right"></i>
              </button>
            </div> : 
            stillTimeLeft ?
            <div className="questions-container">
              {questionsRender}
              <div className="submit-container">
                <button 
                  className="shadow-hover"
                  onClick={() => submitQuiz()}
                >
                  Submit Quiz
                </button>
              </div>
            </div> : 
            <img src={quizImg} alt="" className="quiz-img"/>
          }
        </>  :
        <div className="already-taken">
          <span>You already took this quiz.</span>
          <button 
            onClick={() => history.push(`/courses/${courseID}/quiz/${quizID}/results`)}
            className="shadow-hover"
          >
            View Results
          </button>
          <button 
            onClick={() => history.push(`/courses/course/${courseID}`)}
            className="shadow-hover"
          >
            Back to Course
          </button>
        </div>
      }
      <PageLoader loading={loading} />
    </div>
  )
}
