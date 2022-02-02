import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from "react-router-dom"
import './styles/QuizResults.css'
import { StoreContext } from '../store/store'
import { getCourseByID, getQuestionsByQuizID, getQuizByID } from "../services/courseServices"
import { getUserQuizByID } from "../services/userServices"
import scoreImg from '../assets/imgs/score-img.png'
import { useHistory } from "react-router-dom"
import { cleanAnswer, msToTime } from "../utils/utilities"
import AnswerCard from "../components/quiz/AnswerCard"

export default function QuizResults() {

  const { setNavTitle, setNavDescript, user, myUser } = useContext(StoreContext)
  const courseID = useRouteMatch('/courses/:courseID/quiz/:quizID/results').params.courseID
  const quizID = useRouteMatch('/courses/:courseID/quiz/:quizID/results').params.quizID
  const [course, setCourse] = useState({})
  const [quiz, setQuiz] = useState({})
  const [userQuiz, setUserQuiz] = useState({})
  const [questions, setQuestions] = useState([])
  const [correctedQuestions, setCorrectedQuestions] = useState([])
  const [reviewNotes, setReviewNotes] = useState('')
  const history = useHistory()
  const numOfQuestions = questions.length
  const quizAccess = userQuiz?.quizID === quizID

  const answersRender = questions?.map((question, i) => {
    return <AnswerCard 
    question={question} 
    userQuiz={userQuiz}
    correctedQuestions={correctedQuestions}
    setCorrectedQuestions={setCorrectedQuestions}
    index={i}
    key={i} 
    />
  })

  useEffect(() => {
    getQuizByID(courseID, quizID, setQuiz)
    getQuestionsByQuizID(courseID, quizID, setQuestions)
    getUserQuizByID(user?.uid, quizID, setUserQuiz)
    getCourseByID(courseID, setCourse)
  },[courseID])

  useEffect(() => {
    if(questions.length) {
      questions.forEach((question,i) => {
        correctedQuestions[i] = {
          isCorrect: cleanAnswer(question.answer) === cleanAnswer(userQuiz?.submission ? userQuiz?.submission[i] : '')
        }
      })
      setCorrectedQuestions(prev => [...prev])
    }
  },[questions, userQuiz])

  useEffect(() => {
    setNavTitle('Quiz Results')
    setNavDescript(quiz.name)
  },[quiz])

  return (
    quizAccess ?
    <div className="quiz-results-page">
      <header>
        <div>
          <h3>Quiz Results</h3>
          <big>Your Score</big>
          <h4>
            {userQuiz?.score?.toFixed(1)}% 
            <span>({userQuiz?.points}/{numOfQuestions})</span>
          </h4>
          <small>Time Taken: {msToTime(userQuiz?.minutesTaken * 60_000)}</small>
        </div>
        <img src={scoreImg} alt="" />
      </header>
      <div className="answers-container">
        <h3>Review</h3>
        {answersRender}
        <hr/>
        <section>
          <h4>Review Notes from Instructor</h4>
          <p>{userQuiz?.reviewNotes}</p>
        </section>
        <hr/>
      </div>
      <div className="footer">
        <button 
          onClick={() => history.push(`/courses/course/${courseID}`)}
          className="shadow-hover"
        >
          Back to Course
        </button>
      </div>
    </div> :
    <></>
  )
}
