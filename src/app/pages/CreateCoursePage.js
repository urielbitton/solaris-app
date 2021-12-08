import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import './styles/CreateCoursePage.css'
import {StoreContext} from '../store/store'
import { videoTypes } from '../api/apis'
import { AppInput, AppSelect, AppSwitch, AppTextarea } from '../components/AppInputs'
import { db } from '../firebase/fire'
import LessonCard from '../components/LessonCard'
import AppModal from '../components/AppModal'

export default function CreateCoursePage() {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)
  const courseType = useRouteMatch('/create/create-course/:courseType').params.courseType
  const [videoType, setVideoType] = useState('')
  const [slidePos, setSlidePos] = useState(0)
  const [lessons, setLessons] = useState([])
  const [lessonTitle, setLessonTitle] = useState('')
  const [videos, setVideos] = useState([])
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const newCourseID = db.collection('courses').doc().id

  const languages = [
    {name: 'English', value: 'english'},
    {name: 'French', value: 'french'}
  ]
  const difficulties = [
    {name: 'Basic', value: 'basic'},
    {name: 'Intermediate', value: 'intermediate'},
    {name: 'Advanced', value: 'advanced'}
  ]

  const videoTypesRender = videoTypes?.map((type,i) => {
    return <div 
      className={`type-box ${videoType === type.value ? "active" : ""}`} 
      onClick={() => setVideoType(type.value)}
      key={i} 
    >
      <i className={`${type.icon} main-icon`}></i>
      <h4>{type.name}</h4>
      <i className="fas fa-check-circle check-icon"></i>
    </div>
  })

  const lessonsRender = lessons?.map((lesson,i) => {
    return <LessonCard 
      lesson={lesson} 
      keyword=""
      createMode
      tempVideos={videos}
      initComponent={
        <div className="init-component">
          <h5 onClick={() => setShowVideoModal(true)}><i className="fas fa-video"></i>Click to add videos to this lesson</h5>
          <h5 onClick={() => setShowNotesModal(true)}><i className="fas fa-sticky-note"></i>Click to add notes to this lesson</h5>
        </div>
      }
      deleteBtn={<i className="fas fa-trash-alt" style={{fontSize:16, color: '#444'}}></i>}
      key={i} 
    />
  })

  const newLessonEnterPress = (e) => {
    let keyCode = e.code || e.key;
    if (keyCode === 'Enter') {
      addLesson()
    }
  }
  const addLesson = () => {
    setLessons(prev => 
      [...prev, {
        title: lessonTitle,
        lessonID: db.collection('courses').doc(newCourseID).collection('lessons').doc().id,
        lessonType: videoType,
        notes: [],
        videos: []
      }]
    )
    setLessonTitle('')
  }

  const addVideo = () => {

  }
  const addNotes = () => {
    
  }

  useEffect(() => {
    setNavTitle('Create')
    setNavDescript(`Create ${courseType} course`)
  },[courseType])

  return (
    <div className="create-course-page">
      <div className="create-content">
        <h3>Create {courseType} Course</h3>
        <div className="slide-container">
          <div className={`slide-element ${slidePos === 0 ? "active" : slidePos > 0 ? "prev" : ""}`}>
            <div className="video-type-container">
              <h5 className="create-title">Choose a video type</h5>
              {videoTypesRender}
            </div>
            <div className="course-info">
            <h5 className="create-title">Course Information</h5>
              <h6>Cover Image</h6>
              <label className="upload-container">
                <input style={{display:'none'}} type="file" />
                <i className="fal fa-images"></i>
              </label>
              <AppInput title="Course Title"/>
              <AppSelect title="Language" options={languages} />
              <AppSelect title="Difficulty" options={difficulties} />
              <AppInput title="Course Price ($CAD)" type="number" min={0} />
              <AppTextarea title="Short Description" />
              <AppTextarea title="Full Description" />
              <AppTextarea title="Course Summary" />
              <AppSwitch title="Certificate Offered"/>
              <AppSwitch title="Allow Reviews & Ratings"/>
            </div>
          </div>
          <div className={`slide-element ${slidePos === 1 ? "active" : slidePos > 1 ? "prev" : ""}`}>
            <h5 className="create-title">Add lessons to course</h5>
            <div className="add-lessons-container">
              <div className="added-lessons">
                {lessonsRender}
              </div>
              <div className="lesson-input-generator">
                <input 
                  placeholder="Enter a lesson title... (press enter)" 
                  onChange={(e) => setLessonTitle(e.target.value)} 
                  onKeyPress={(e) => newLessonEnterPress(e)}
                  value={lessonTitle}
                />
                <div className="icon-container" onClick={() => addLesson()}>
                  <i className="far fa-plus"></i>
                </div>
              </div>
            </div>
            <AppModal 
              title="Add Videos"
              showModal={showVideoModal}
              setShowModal={setShowVideoModal}
              actions={<button onClick={() => addVideo()}>Add</button>}
            />
            <AppModal 
              title="Add Notes"
              showModal={showNotesModal}
              setShowModal={setShowNotesModal}
              actions={<button onClick={() => addNotes()}>Add</button>}
            />
          </div>
        </div>
        <div className="create-nav">
          <button 
            onClick={() => slidePos > 0 && setSlidePos(prev => prev - 1)}
            className={!(slidePos > 0) ? "disable" : ""}
          >Back
          </button>
          <button 
            onClick={() => slidePos < 3 && setSlidePos(prev => prev + 1)}
            className={!(slidePos < 3) ? "disable" : ""}
          >Next
          </button>
        </div>
      </div>
      <div className="side-bar hidescroll">
        meta sidebar
      </div>
    </div>
  )
}
