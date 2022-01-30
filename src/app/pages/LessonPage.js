import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import './styles/LessonPage.css'
import LessonsList from '../components/course/LessonsList'
import WriteComment from '../components/course/WriteComment'
import { getCourseByID, getLessonByID, getLessonsByCourseID, 
  getVideosByLessonID, getVideoByID, getCommentsByVideoID, 
  getNotesByLessonID, getAllVideosByCourseID, getLessonNotesByUserAndLessonID, getLessonFilesByLessonID } from '../services/courseServices'
import { getInstructorByID } from '../services/InstructorServices'
import { StoreContext } from '../store/store'
import VideoEmbed from '../components/course/VideoEmbed'
import CommentCard from '../components/course/CommentCard'
import { getCoursesIDEnrolledByUserID } from '../services/userServices'
import lockedImg from '../assets/imgs/locked-content.png'
import { convertFireDateToString } from '../utils/utilities'
import { useWindowDimensions } from "../utils/customHooks"
import { deleteSubDB, setSubDB } from "../services/CrudDB"
import FileItem from '../components/course/FileItem'
import AppModal from "../components/ui/AppModal"
import { deleteStorageFile, uploadMultipleFilesToFireStorage } from "../services/storageServices"
import { db } from "../firebase/fire"

export default function LessonPage() {

  const {setNavTitle, setNavDescript, user, myUser} = useContext(StoreContext)
  const courseID = useRouteMatch('/courses/course/:courseID')?.params.courseID
  const lessonID = useRouteMatch('/courses/course/:courseID/lesson/:lessonID')?.params.lessonID
  const videoID = useRouteMatch('/courses/course/:courseID/lesson/:lessonID/:videoID')?.params.videoID
  const [course, setCourse] = useState([])
  const [lessons, setLessons] = useState([])
  const [videos, setVideos] = useState([])
  const [lesson, setLesson] = useState({})
  const [video, setVideo] = useState({})
  const [notes, setNotes] = useState([])
  const [instructor, setInstructor] = useState({})
  const [comments, setComments] = useState([])
  const [userCourses, setUserCourses] = useState([])
  const [foldSidebar, setFoldSidebar] = useState(false)
  const [allCourseVideos, setAllCourseVideos] = useState([])
  const [playPosition, setPlayPosition] = useState(0)
  const [myLessonNotes, setMyLessonNotes] = useState({})
  const [showAddNotes, setShowAddNotes] = useState(false)
  const [myNotesText, setMyNotesText] = useState('')
  const [allLessonFiles, setAllLessonFiles] = useState([])
  const [showFilesModal, setShowFilesModal] = useState(false)
  const [lessonFiles, setLessonFiles] = useState([])
  const [notesFile, setNotesFile] = useState('')
  const courseUserAccess = userCourses.findIndex(x => x.courseID === courseID) > -1
  const history = useHistory()
  const { screenWidth } = useWindowDimensions()
  const isCourseInstructor = course?.instructorID === myUser?.instructorID || myUser?.isAdmin
 
  const commentsRender = comments?.map((comment,i) => {
    return <CommentCard 
      comment={comment} 
      key={i} 
      type="comment"
      courseID={courseID}
      lessonID={lessonID}
      videoID={videoID}
    />
  })

  const lessonNotesRender = notes?.map((note,i) => {
    return <div className='lesson-note-section' key={'note'+i}>
      <div>
        <h4>{note.title}</h4>
        <small>{convertFireDateToString(note.dateAdded)}</small>
      </div>
      <p>{note.text}</p>
    </div>
  })

  const lessonFilesRender = allLessonFiles?.map((file, i) => {
    return <FileItem 
      file={file} 
      customType
      deleteClick={() => deleteFile(lessonID, file)}
      showDelete={isCourseInstructor}
      truncateTextAmount={50}
      key={i} 
    />
  })

  const addCustomNotes = () => {
    if(myNotesText.length) {
      setSubDB('users', user?.uid, 'lessonNotes', lessonID, {
        dateAdded: new Date(),
        lessonNoteID:  lessonID,
        text: myNotesText
      }, true)
      .then(() => {
        setShowAddNotes(false)
        setMyNotesText('')
      })
      .catch(error => {
        console.log(error)
        window.alert('There was an error saving your notes. Please try again later.')
      })
    }
  }

  const prepareMyNotesEdit = () => {
    setShowAddNotes(true)
    setMyNotesText(myLessonNotes?.text)
  }

  const handleEnterPress = (e) => {
    if(e.key === 'Enter' && e.shiftKey) return
    else if(e.key === 'Enter') {
      e.preventDefault()
      addCustomNotes()
    }
  }

  const deleteNote = () => {
    const confirm = window.confirm('Are you sure you want to delete this note?')
    if(confirm) {
      deleteSubDB('users', user?.uid, 'lessonNotes', lessonID)
      .then(() => {
        setMyNotesText('')
        setShowAddNotes(false)
      })
      .catch(error => {
        window.alert('There was an error deleting your notes. Please try again later.')
        console.log(error)
      })
    }
  }

  const deleteFile = (lessonID, file) => {
    if(isCourseInstructor) {
      const confirm = window.confirm('Are you sure you want to remove this file')
      if(confirm) {
        db.collection('courses').doc(courseID)
        .collection('lessons').doc(lessonID)
        .collection('files').doc(file.fileID)
        .delete()
        .then(() => {
          deleteStorageFile(`/courses/${courseID}/lessons/${lessonID}/files`, file.fileName)
          .then(() => {
            console.log('File deleted.')
            window.alert('File deleted successfully.')
          })
          .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
      }
    }
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

  const handleFileUpload = (e) => {
    if(isCourseInstructor) {
      setNotesFile(e.target.files)
      setLessonFiles(e.target.files)
    }
  }

  const uploadFiles = () => {
    if(isCourseInstructor) {
      uploadMultipleFilesToFireStorage(
        lessonFiles, 
        `/courses/${courseID}/lessons/${lessonID}/files`,
        `/courses/${courseID}/lessons/${lessonID}/files`
      )
      .then(() => {
        setShowFilesModal(false)
      })
      .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    getLessonsByCourseID(courseID, setLessons)
    getCourseByID(courseID, setCourse)

    if(!allCourseVideos.length) {
      getAllVideosByCourseID(courseID, setAllCourseVideos) 
    }
  },[courseID])

  useEffect(() => {
    getLessonByID(courseID, lessonID, setLesson)
    getVideosByLessonID(courseID, lessonID, setVideos)
    getNotesByLessonID(courseID, lessonID, setNotes)
    getLessonFilesByLessonID(courseID, lessonID, setAllLessonFiles)
  },[lessonID])

  useEffect(() => {
    getVideoByID(courseID, lessonID, videoID, setVideo)
    getCommentsByVideoID(courseID, lessonID, videoID, setComments)
  },[videoID])

  useEffect(() => {
    getCoursesIDEnrolledByUserID(user?.uid, setUserCourses)
  },[user])

  useEffect(() => {
    setNavTitle('Lesson')
    setNavDescript(course?.title)
    getInstructorByID(course?.instructorID, setInstructor)
  },[course])  

  useEffect(() => {
    getLessonNotesByUserAndLessonID(user?.uid, lessonID, setMyLessonNotes)
  },[user, lessonID])

  return (
    <div className="lesson-page">
      <div className={`lesson-sidebar ${foldSidebar ? "folded" : ""}`}>
        <div className='lesson-sidebar-container hidescroll'>
          <LessonsList 
            lessons={lessons} 
            courseID={courseID} 
            showSearch
            activeLesson={lessonID}
            courseUserAccess={courseUserAccess}
            videoTitleLength={screenWidth < 1370 ? 100 : 32}
          />
        </div>
        <div className='side-bar-latch' onClick={() => setFoldSidebar(prev => !prev)}>
          <i className={`fal fa-angle-${foldSidebar ? "right" : "left"}`}></i>
        </div>
      </div>
      <div className={`lesson-content ${foldSidebar ? "full" : ""}`}>
        <div className="lesson-video-container">
          <div className='title-row'>
            <h3>Lesson: {lesson?.title}</h3>
            <button onClick={() => history.push(`/courses/course/${courseID}`)}><i className='fal fa-arrow-left'></i>Back to Course</button>
          </div>
          <h6>{videos.length} video{videos.length !== 1 ? "s" : ""} in this lesson</h6>
          <h6 className='video-title'>{video?.title}</h6>
          { courseUserAccess ? 
          <>
            <VideoEmbed 
              embedUrl={lesson.videoType === "youtube" ? `https://www.youtube.com/embed/${video?.url?.split('v=')[1]}` : video?.url}
            />
            <div className="video-actions-nav">
              <button 
                className="shadow-hover"
                onClick={() => playPosition > 0 && setPlayPosition(prev => prev - 1)}
              >
                Previous
              </button>
              <button 
                className="shadow-hover"
                onClick={() => playPosition < allCourseVideos.length-1 && setPlayPosition(prev => prev + 1)}
              >
                Next
              </button>
            </div>
            <section className="lesson-text-contents">
              <h3 className="page-title">Lesson Material</h3>
              <div className='lesson-material'>
                {lessonNotesRender}
              </div>
            </section>
            <section className="lesson-files">
              <h3 className="page-title">Lesson Files</h3>
              <div className="lesson-files-flex">
                {lessonFilesRender}
              </div>
              { 
                isCourseInstructor ?
                <button 
                  className="shadow-hover"
                  onClick={() => setShowFilesModal(true)}
                >
                  Upload Files
                </button> :
                <></>
              }
            </section>
            <div className="lesson-my-notes-section">
              <h3 className="page-title">My Notes</h3>
              <div className="my-notes-container">
              { 
                myLessonNotes?.text &&
                <p className={showAddNotes ? "fade" : ""}>
                  {myLessonNotes?.text}
                  <i className="fal fa-pen" onClick={() => prepareMyNotesEdit()}></i>
                  <i className="fal fa-trash-alt delete" onClick={() => deleteNote()}></i>
                </p>
              }
              {
                showAddNotes &&
                <>
                  <textarea 
                    onChange={(e) => setMyNotesText(e.target.value)}
                    value={myNotesText} 
                    onKeyPress={(e) => handleEnterPress(e)}
                  /> 
                  <div className="btn-group">
                    <button onClick={() => addCustomNotes()}>Save</button>
                    <button onClick={() => setShowAddNotes(false)}>Cancel</button>
                  </div>
                </>
              }
              { !myLessonNotes?.text && !showAddNotes &&
                <button 
                  className="shadow-hover"
                  onClick={() => {
                    setShowAddNotes(true)
                    setMyNotesText(myLessonNotes?.text)
                  }}
                >Add Notes</button>
              }
              </div>
            </div>
            <div className="seperator"/>
            <div className="lesson-comments-section">
              <h3 className="page-title">Comments ({comments.length})</h3>
              <div className="comments-container">
                {commentsRender}
              </div>
            </div>
            <div className="leave-reply-section">
              <WriteComment 
                course={course}
                instructor={instructor}
                courseID={courseID}
                lessonID={lessonID}
                videoID={videoID}
                lesson={lesson}
                writeType="comment"
                mainTitle="Leave a Reply"
                messageInput="Enter Reply"
                canReview={courseUserAccess}
              />
            </div>
          </> :
        <div className="locked-content">
          <h3>This lesson is locked.</h3>
          <h5>Please purchase the course in order to view this lesson.</h5>
          <img src={lockedImg} alt="" />
          <button className="shadow-hover" onClick={() => history.push(`/checkout/course/${courseID}`)}>Purchase Course</button>
        </div>
        }
      </div>
      </div>
      <AppModal 
        title="Add Files"
        showModal={showFilesModal}
        setShowModal={setShowFilesModal}
        actions={<>
          <button onClick={() => uploadFiles()}>Add Files</button>
          <button onClick={() => setShowFilesModal(false)}>Cancel</button>
        </>}
      >
        <div className="form single-columns">
          <label className={`commoninput fileinput`}>
              <h6>Add Files</h6>
              <input
                type="file" multiple 
                onChange={(e) => handleFileUpload(e)} 
                accept=".pdf, .docx, .doc, .pptx, .ppt, .xlsx, .xls, .png, .jpg, jpeg, jfif, .mp3, .wav, .zip, .rar" 
              />
              <div className="icon-container">
                <i className="fal fa-file-pdf"></i>
                <small>{showNotesFileNum(notesFile?.length)}</small>
              </div>
          </label>
        </div>
      </AppModal>
    </div>
  )
}
