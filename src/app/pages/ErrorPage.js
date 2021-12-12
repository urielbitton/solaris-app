import React from 'react'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

export default function ErrorPage() {

  const history = useHistory()

  return (
    <div className="error-page">
      <h1>Error Page</h1>
      <button onClick={() => history.push('/')}>Back Home</button>
    </div>
  )
}
