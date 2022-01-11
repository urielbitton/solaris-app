import React, { useState } from 'react'
import { useHistory } from "react-router"
import './styles/ErrorPage.css'
import readingTime from '../assets/imgs/reading-time.png'

export default function ErrorPage() {

  const [makeGray, setMakeGray] = useState(false)
  const history = useHistory()

  return (
    <div className={`error-page ${makeGray ? "gray" : ""}`}>
      <img src={readingTime} alt="error 404"/>
      <h1>Error 404</h1>
      <h6>Oops, the page you're looking for was not found.</h6>
      <button
        onClick={() => history.push('/')}
        onMouseEnter={() => setMakeGray(true)}
        onMouseLeave={() => setMakeGray(false)}
        className="shadow-hover"
      >
        <i className="fal fa-home"></i>
        Back Home
      </button>
    </div>
  )
}
