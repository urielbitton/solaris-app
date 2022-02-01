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
  const [score, setScore] = useState(0) 
  const [displayedScore, setDisplayedScore] = useState(0)
  const [correctNum, setCorrectNum] = useState(0)
  const history = useHistory()
  let numOfQuestions = questions.length
  let points = 0
  const quizAccess = userQuiz.quizID === quizID || myUser?.instructorID === course?.instructorID

  const answersRender = questions?.map((question, i) => {
    return <AnswerCard 
      question={question} 
      userQuiz={userQuiz}
      index={i}
      key={i} 
    />
  })

  const calculateScore = (userAnswers) => {
    points = calculatePoints(numOfQuestions, userAnswers)
    setScore((points / numOfQuestions) * 100)
    setCorrectNum(points)
  }

  const calculatePoints = (numOfQuestions, userAnswers) => {
    for(let i = 0; i < numOfQuestions; i++) {
      cleanAnswer(questions[i].answer) === cleanAnswer(userAnswers[i]) && points++
    }
    return points
  }

  useEffect(() => {
    getQuizByID(courseID, quizID, setQuiz)
    getQuestionsByQuizID(courseID, quizID, setQuestions)
    getUserQuizByID(user?.uid, quizID, setUserQuiz)
    getCourseByID(courseID, setCourse)
  },[courseID])

  useEffect(() => {
    if(userQuiz?.submission) {
      calculateScore(userQuiz.submission)
    }
    setDisplayedScore((userQuiz?.customScore/numOfQuestions) * 100)
  },[userQuiz])

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
            {!isNaN(displayedScore) ? displayedScore : score.toFixed(1)}% 
          </h4>
          <small>Time Taken: {msToTime(userQuiz?.minutesTaken * 60_000)}</small>
        </div>
        <img src={scoreImg} alt="" />
      </header>
      <div className="answers-container">
        <h3>Review</h3>
        {answersRender}
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
