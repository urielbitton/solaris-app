import React, { useContext, useEffect } from 'react'
import './styles/CreateQuiz.css'
import { StoreContext } from '../store/store'

export default function CreateQuiz() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)

  useEffect(() => {
    setNavTitle('Create Quiz')
    setNavDescript('')
  },[])

  return (
    <div className="create-quiz-page">
      Create Quiz
    </div>
  )
}
