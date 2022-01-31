import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from "react-router-dom"
import './styles/QuizResults.css'
import { StoreContext } from '../store/store'
import { getQuestionsByQuizID, getQuizByID } from "../services/courseServices"
import { getUserQuizByID } from "../services/userServices"
import scoreImg from '../assets/imgs/score-img.png'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { cleanAnswer, msToTime } from "../utils/utilities"

export default function QuizResults() {

  const { setNavTitle, setNavDescript, user } = useContext(StoreContext)
  const courseID = useRouteMatch('/courses/:courseID/quiz/:quizID/results').params.courseID
  const quizID = useRouteMatch('/courses/:courseID/quiz/:quizID/results').params.quizID
  const [quiz, setQuiz] = useState({})
  const [userQuiz, setUserQuiz] = useState({})
  const [questions, setQuestions] = useState([])
  const [score, setScore] = useState(0)
  const [displayedScore, setDisplayedScore] = useState(0)
  const [correctNum, setCorrectNum] = useState(0)
  const history= useHistory()
  let numOfQuestions = questions.length
  let points = 0
  const quizAccess = userQuiz.quizID === quizID

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
            {/* <span>- ({displayedScore}/{numOfQuestions})</span> */}
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

export function AnswerCard(props) {

  const { answer, title, order } = props.question
  const { userQuiz, index } = props
  const isCorrect = cleanAnswer(answer) === cleanAnswer(userQuiz?.submission ? userQuiz?.submission[index] : '')

  return (
    <div className={`answer-card ${isCorrect ? "correct" : ""}`}>
      <div className="header">
        <div>
          {
            isCorrect ?
            <i className="far fa-check"></i> :
            <i className="far fa-times"></i>
          }      
          <h5>{order}.</h5>  
          <p>{title}</p>
        </div>
        <span className="true-false">{isCorrect ? 'correct' : "wrong"}</span>
      </div>
      <div className="your-answer">
        <small>
          Your answer: &nbsp;
          <span>{userQuiz?.submission ? userQuiz?.submission[index] : ''}</span>
        </small>
      </div>
      <div className="correct-answer">
        <small>
          Correct answer: &nbsp;
          <span>{answer}</span>
        </small>
      </div>
    </div>
  )
}
