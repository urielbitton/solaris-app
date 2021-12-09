import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router'
import './styles/CreateCoursePage.css'
import {StoreContext} from '../store/store'
import { videoTypes } from '../api/apis'
import { AppInput, AppSelect, AppSwitch, AppTextarea } from '../components/AppInputs'
import { db } from '../firebase/fire'
import LessonCard from '../components/LessonCard'
import AppModal from '../components/AppModal'
import { getYoutubeVideoDetails } from '../services/youtubeServices'
import { convertYoutubeDuration } from '../utils/utilities'

export default function CreateCoursePage() {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)
  const courseType = useRouteMatch('/create/create-course/:courseType').params.courseType
  const [videoType, setVideoType] = useState('')
  const [slidePos, setSlidePos] = useState(0)
  const [lesson, setLesson] = useState({})
  const [lessons, setLessons] = useState([])
  const [lessonTitle, setLessonTitle] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [videoDuration, setVideoDuration] = useState(0)
  const [videoUrl, setVideoUrl] = useState('')
  const [notesTitle, setNotesTitle] = useState('')
  const [notesText, setNotesText] = useState('')
  const [notesFileText, setNotesFileText] = useState('')
  const [notesFile, setNotesFile] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')
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
      tempVideos={lesson.videos}
      notes={lesson.notes}
      files={notesFile}
      noClick
      courseUserAccess
      initComponent={
        <div className="init-component">
          <h5 onClick={() => {setShowVideoModal(true);setLesson(lesson)}}><i className="fas fa-video"></i>Click to add videos to this lesson</h5>
          <h5 onClick={() => {setShowNotesModal(true);setLesson(lesson)}}><i className="fas fa-sticky-note"></i>Click to add notes to this lesson</h5>
        </div>
      }
      deleteBtn={
        <i className="fas fa-trash-alt" style={{fontSize:16}} onClick={(e) => deleteLesson(e, lesson)}></i>
      }
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
    if(lessonTitle.length) {
      setLessons(prev => 
        [...prev, {
          title: lessonTitle,
          lessonID: db.collection('courses').doc(newCourseID).collection('lessons').doc().id,
          lessonType: courseType,
          notes: [],
          videos: [],
          files: []
        }]
      )
      setLessonTitle('')
    }
  }

  const deleteLesson = (e, lesson) => {
    e.stopPropagation()
    const confirm = window.confirm('You are about to delete this lesson.')
    if(confirm) {
      const index = lessons.findIndex(x => x.lessonID === lesson.lessonID)
      lessons.splice(index, 1)
      setLessons(prev => [...prev])
    }
  }

  const addVideo = () => {
    if(videoTitle.length && videoUrl.length) {
      lesson.videos.push({
        title: videoTitle,
        duration: videoDuration,
        url: videoUrl,
        videoID: db.collection('courses').doc(newCourseID).collection('lessons').doc(lesson.lessonID).collection('videos').doc().id,
        dateAdded: new Date()
      })
      setVideoTitle('')
      setVideoDuration(0)
      setVideoUrl('')
      setShowVideoModal(false)
    }
  }

  const addNotes = () => {
    if(notesTitle.length || notesFile.length) {
      lesson.notes.push({
        title: notesTitle,
        text: notesText,
        dateAdded: new Date()
      })
      lesson.files.push([...notesFile])
      setNotesTitle('')
      setNotesText('')
      setShowNotesModal(false)
    }
  }

  const handleFileUpload = (e) => {
    setNotesFileText(e.target.value)
    setNotesFile(e.target.files)
  }

  const showNotesFileNum = (filesNum) => {
    if(filesNum) {
      if(filesNum > 1 && filesNum < 3) {
        return `${notesFile[0].name}, ${notesFile[1].name}`
      }
      else if(filesNum > 2) {
        return `${notesFile[0].name}, ${notesFile[1].name} and ${filesNum - 2} more files`
      } 
      else if(filesNum <= 1) {
        return notesFile[0].name
      }
    }
    else {
      return "No Documents Attached"
    }
  }

  const handleYoutubeLink = (e) => {
    let videoUrlID = e.target.value
    if(videoUrlID.includes('watch?v=')) {
      videoUrlID = videoUrlID.split('watch?v=')[1].split('&')[0]
    }
    else {
      videoUrlID = videoUrlID.split('be/')[1]
    }
    setYoutubeLink(videoUrlID)
  }

  useEffect(() => {
    setNavTitle('Create')
    setNavDescript(`Create ${courseType} course`)
  },[courseType])

  useEffect(() => {
    getYoutubeVideoDetails(youtubeLink)
    .then(res => {
      setVideoTitle(res.data.items[0].snippet.title)
      setVideoDuration(convertYoutubeDuration(res.data.items[0].contentDetails.duration))
      setVideoUrl(youtubeLink)
    })
    .catch(err => console.log(err))
  },[youtubeLink])

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
            >
              <div className="form">
                <AppInput title="Video Title" onChange={(e) => setVideoTitle(e.target.value)} value={videoTitle} />
                <AppInput title="Duration (Format: hh:mm:ss)" onChange={(e) => setVideoDuration(e.target.value)} value={videoDuration} />
                <AppInput title="Video URL ID" onChange={(e) => {setVideoUrl(e.target.value);setYoutubeLink('')}} value={videoUrl}/>
                { videoUrl && 
                  <label className="commoninput">
                    <h6>Video Preview</h6>
                    <a href={youtubeLink ? `https://youtube.com/watch?v=${videoUrl}`: videoUrl} target="_blank" rel="noreferrer">
                      <i className="fas fa-play"></i>
                      Preview
                    </a>
                  </label> 
                }
                <span className="seperator"><hr/>Or auto-detect with YouTube video link<hr/></span>
                <AppInput title="YouTube Video Link" onChange={(e) => handleYoutubeLink(e)} value={youtubeLink}/>
              </div>
            </AppModal>
            <AppModal 
              title="Add Notes"
              showModal={showNotesModal}
              setShowModal={setShowNotesModal}
              actions={<button onClick={() => addNotes()}>Add</button>}
            >
              <div className="form single-columns">
                <AppInput title="Notes Title" onChange={(e) => setNotesTitle(e.target.value)} value={notesTitle} />
                <AppTextarea title="Notes Text" onChange={(e) => setNotesText(e.target.value)} value={notesText} />
                <label className="commoninput fileinput">
                    <h6>Add File</h6>
                    <input 
                      type="file" multiple 
                      onChange={(e) => handleFileUpload(e)} 
                      accept=".pdf, .docx, .doc, .pptx, .ppt, .xlsx, .xls" 
                    />
                    <div className="icon-container">
                      <i className="fal fa-file-pdf"></i>
                      <small>{showNotesFileNum(notesFile.length)}</small>
                    </div>
                </label>
              </div>
            </AppModal>
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
