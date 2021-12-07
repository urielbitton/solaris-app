import React from 'react'
import { useHistory } from 'react-router'
import { createCourseArray } from '../api/apis'
import './styles/CreatePage.css'

export default function CreatePage() {

  const history = useHistory()

  const createRender = createCourseArray?.map((poster,i) => {
    return <div className="create-poster" key={i} onClick={() => history.push(poster.url)}>
      <div className="side">
        <h2 className="hover-to-white">{poster.title}</h2>
        <div className="features">
          {
            poster.features.map((feat,j) => {
              return <h5 className="hover-to-white" key={j}>
                <i className="far fa-circle-notch"></i>
                {feat.text}
              </h5>
            })
          }
        </div>
      </div>
      <div className="side">
        <h6 className="hover-to-white">{poster.idea}</h6>
        <button>Create<i className="far fa-arrow-right"></i></button>
      </div>
    </div>
  })

  return (
    <div className="create-page">
      <h3>Create A Course</h3>
      <div className="create-flex">
        {createRender}
      </div>
    </div>
  )
}
