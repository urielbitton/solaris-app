import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useRouteMatch, useHistory } from "react-router-dom";
import './styles/QuizResults.css'
import { getCourseByID, getQuestionsByQuizID, getQuizByID } from "../services/courseServices";
import { getUserByID, getUserQuizByID } from "../services/userServices";
import { StoreContext } from "../store/store";
import AnswerCard from "../components/quiz/AnswerCard";
import { cleanAnswer, msToTime } from "../utils/utilities"
import scoreImg from '../assets/imgs/score-img.png'
import { updateSubDB } from '../services/CrudDB'
import { AppTextarea } from '../components/ui/AppInputs'

export default function StudentQuizResults() {

  const { setNavTitle, setNavDescript, myUser } = useContext(StoreContext)
  const courseID = useRouteMatch('/courses/:courseID/quiz/:quizID/:studentID/results').params.courseID
  const quizID = useRouteMatch('/courses/:courseID/quiz/:quizID/:studentID/results').params.quizID
  const studentID = useRouteMatch('/courses/:courseID/quiz/:quizID/:studentID/results').params.studentID
  const [course, setCourse] = useState({})
  const [quiz, setQuiz] = useState({})
  const [userQuiz, setUserQuiz] = useState({})
  const [student, setStudent] = useState({})
  const [questions, setQuestions] = useState([])
  const [correctedQuestions, setCorrectedQuestions] = useState([])
  const [reviewNotes, setReviewNotes] = useState('')
  const quizAccess = myUser?.instructorID === course?.instructorID
  const history = useHistory()
  const location = useLocation()
  const scrollTopRef = useRef()
  const editMode = location.search.includes('edit=true')
  const numOfQuestions = questions.length

  const answersRender = questions?.map((question, i) => {
    return <AnswerCard 
      question={question} 
      userQuiz={userQuiz}
      editMode={editMode}
      correctedQuestions={correctedQuestions}
      setCorrectedQuestions={setCorrectedQuestions}
      index={i}
      key={i} 
    />
  })

  const saveReview = () => {
    const customScore = correctedQuestions?.reduce((a,b) => a + (b.isCorrect ? 1 : 0), 0)
    updateSubDB('users', studentID, 'quizes', quizID, {
      score: (customScore/numOfQuestions) * 100,
      manualGrade: true,
      reviewNotes
    })
    .then(() => scrollTopRef?.current?.scroll({top:0, behavior:'smooth'}))
    .catch(err => console.log(err))
  }

  useEffect(() => {
    getQuizByID(courseID, quizID, setQuiz)
    getQuestionsByQuizID(courseID, quizID, setQuestions)
    getUserQuizByID(studentID, quizID, setUserQuiz)
    getCourseByID(courseID, setCourse)
    getUserByID(studentID, setStudent)
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
    setNavTitle(!editMode ? 'Quiz Results' : 'Review Quiz')
    setNavDescript(quiz.name)
  },[quiz])

  return (
    quizAccess ?
    <div className="quiz-results-page">
      <header ref={scrollTopRef}>
        <div>
          <h3>Quiz Results - {student?.firstName} {student?.lastName}</h3>
          <big>Student Score</big>
          <h4>
            {userQuiz?.score?.toFixed(1)}% 
            <span>
              ({userQuiz?.points}/{numOfQuestions}) 
              {userQuiz?.manualGrade && <span style={{color:'var(--color)'}}>- Manually corrected</span>}
            </span>
          </h4>
          <small>Time Taken: {msToTime(userQuiz?.minutesTaken * 60_000)}</small>
        </div>
        <img src={scoreImg} alt="" />
      </header>
      <div className="answers-container">
        <h3>Review</h3>
        {answersRender}
        <hr/>
        <AppTextarea
          title="Add Review Notes/Comments for student"
          placeholder="Some notes or comments..."
          onChange={(e) => setReviewNotes(e.target.value)}
          value={reviewNotes}
        />
      </div>
      <div className="btn-group">
        <button 
          onClick={() => saveReview()}
          className="shadow-hover"
        >
          Save Review
        </button>
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
