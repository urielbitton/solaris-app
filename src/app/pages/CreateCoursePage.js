import React, { useContext, useEffect, useRef, useState } from 'react'
import { useRouteMatch } from 'react-router'
import './styles/CreateCoursePage.css'
import {StoreContext} from '../store/store'
import { videoTypes } from '../api/apis'
import { AppInput, AppSelect, AppSwitch, AppTextarea } from '../components/AppInputs'
import { db } from '../firebase/fire'
import firebase from 'firebase'
import LessonCard from '../components/LessonCard'
import AppModal from '../components/AppModal'
import { getYoutubeVideoDetails } from '../services/youtubeServices'
import { convertYoutubeDuration, fileTypeConverter, truncateText, uploadImgLocal } from '../utils/utilities'
import { setDB, updateDB } from '../services/CrudDB'
import { getCourseCategories } from '../services/adminServices'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

export default function CreateCoursePage() {

  const {setNavTitle, setNavDescript, setWindowPadding, myUser, user} = useContext(StoreContext)
  const courseType = useRouteMatch('/create/create-course/:courseType').params.courseType
  const [courseTitle, setCourseTitle] = useState('')
  const [courseCover, setCourseCover] = useState('')
  const [courseLang, setCourseLang] = useState('english')
  const [courseDifficulty, setCourseDifficulty] = useState('easy')
  const [courseCategory, setCourseCategory] = useState('')
  const [coursePrice, setCoursePrice] = useState('')
  const [courseShortDescript, setCourseShortDescript] = useState('')
  const [courseFullDescript, setCourseFullDescript] = useState('')
  const [courseSummary, setCourseSummary] = useState('')
  const [courseCertificate, setCourseCertificate] = useState(true)
  const [allowReviews, setAllowReviews] = useState(true)
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
  const [editVideoMode, setEditVideoMode] = useState({mode: false, video: {}})
  const [editNotesMode, setEditNotesMode] = useState({mode: false, notes: {}})
  const [categoriesArr, setCategoriesArr] = useState([])
  const newCourseID = db.collection('courses').doc().id
  const inputRef = useRef()
  const history = useHistory()
  const totalNotesNum = lessons?.reduce((a,b) => a + b.notes.length, 0)
  const totalFilesNum = lessons?.reduce((a,b) => a + b.files.reduce((x,y) => x + y.length, 0), 0)
  const createCourseAccess = lessons.length && courseTitle.length && courseCover.length && coursePrice.length 
    && courseShortDescript && videoType.length
  const batch = db.batch()

  const languages = [
    {name: 'English', value: 'english'},
    {name: 'French', value: 'french'}
  ]
  const difficulties = [
    {name: 'Basic', value: 'basic'},
    {name: 'Intermediate', value: 'intermediate'},
    {name: 'Advanced', value: 'advanced'}
  ]
  const courseSummaryArr = [
    {title: 'Course Name', value: courseTitle},
    {title: 'Course Type', value: courseType},
    {title: 'Course Price', value: "$"+coursePrice},
    {title: 'Course Description', value: courseShortDescript}
  ]
  
  const courseCategoriesOpts = categoriesArr?.map((cat,i) => {
    return {name: cat.name}
  })

  const courseSummaryRender = courseSummaryArr?.map((sum,i) => {
    return <div className="review-row" key={i}>
      <h6>{sum.title}</h6>
      <span>{sum.value}</span>
    </div>
  })

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
  
  const courseFilesRender = lessons?.map((lesson,i) => {
    return <div className='lesson-block'>
      <h5>{lesson.title}</h5>
      {
        lesson?.files?.map((file,j) => { 
          return file?.map((fl,k) => { 
          return <div className='file-item' key={k}>
            <div className='icon-container' style={{background: `${fileTypeConverter(fl.type).color}33`}}>
              <i className={fileTypeConverter(fl.type).icon} style={{color: fileTypeConverter(fl.type).color}}></i>
            </div>
            <div className='file-name'>
              <h6 title={fl.name}>{truncateText(fl.name, 30)}</h6>
              <small>{fileTypeConverter(fl.type).name} file</small>
            </div>
          </div>
          })
        })
      }
    </div>
  })

  const courseNotesRender = lessons?.map((lesson,i) => {
    return lesson?.notes?.map((note,j) => { 
      <h5>{lesson.title}</h5>
      return <div className='lesson-block'>
        <div className='note-item' key={j}>
          <h6 title={note.title}>{truncateText(note.title, 40)}</h6>
          <small>{truncateText(note.text, 300)}</small>
        </div>
      </div>
    })
  })

  const clickAddVideo = (lesson) => {
    setShowVideoModal(true)
    setEditVideoMode({mode: false, video: {}})
    setLesson(lesson)
    clearVideoState()
  }
  const clickAddNotes = (lesson) => {
    setShowNotesModal(true)
    setEditNotesMode({mode: false, notes: {}})
    setLesson(lesson)
    clearNotestate()
  }
  const onVideoClick = (lesson, video) => {
    setLesson(lesson)
    setShowVideoModal(true)
    setEditVideoMode({mode: true, video: video})
    setVideoTitle(video.title)
    setVideoDuration(video.duration)
    setVideoUrl(video.url)
  }
  const onNotesClick = (lesson, notes) => {
    setLesson(lesson)
    setShowNotesModal(true)
    setEditNotesMode({mode: true, notes: notes})
    setNotesTitle(notes.title)
    setNotesText(notes.text)
  }

  const lessonsRender = lessons?.map((lesson,i) => {
    return <LessonCard 
      lesson={lesson} 
      keyword="" 
      createMode 
      tempVideos={lesson.videos}
      notes={lesson.notes}
      files={lesson.files}
      notOpenVideoPage
      onVideoClick={(video) => onVideoClick(lesson, video)}
      onNotesClick={(notes) => onNotesClick(lesson, notes)}
      courseUserAccess
      initComponent={
        <div className="init-component">
          <h5 onClick={() => clickAddVideo(lesson)}><i className="fas fa-video"></i>Click to add videos to this lesson</h5>
          <h5 onClick={() => clickAddNotes(lesson)}><i className="fas fa-sticky-note"></i>Click to add notes to this lesson</h5>
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
          videoType,
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

  const addEditVideo = () => {
    if(videoTitle.length && videoUrl.length) {
      if(!editVideoMode.mode) {
        lesson.videos.push({
          title: videoTitle,
          duration: videoDuration,
          url: videoUrl,
          videoID: db.collection('courses').doc(newCourseID).collection('lessons').doc(lesson.lessonID).collection('videos').doc().id,
          dateAdded: new Date()
        })
      }
      else {
        let videoIndex = lesson.videos.findIndex(x => x.videoID === editVideoMode.video.videoID)
        lesson.videos[videoIndex] = {
          title: videoTitle,
          duration: videoDuration,
          url: videoUrl,
          videoID: lesson.videos[videoIndex].videoID,
          dateAdded: new Date()
        }
      }
      clearVideoState()
      setShowVideoModal(false) 
    }
  }

  const addEditNotes = () => {
    if(notesTitle.length || notesFile) { 
      if(!editNotesMode.mode) {
        lesson.notes.push({
          title: notesTitle,
          text: notesText,
          dateAdded: new Date(),
          noteID: db.collection('courses').doc(newCourseID).collection('lessons').doc(lesson.lessonID).collection('notes').doc().id
        })
        notesFile && lesson.files.push([...notesFile])
      }
      else {
        let notesIndex = lesson.notes.findIndex(x => x.noteID === editNotesMode.notes.noteID)
        lesson.notes[notesIndex] = {
          title: notesTitle,
          text: notesText,
          noteID: lesson.notes[notesIndex]?.noteID,
          dateAdded: new Date()
        }
      }
      clearNotestate()
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

  const convertYoutubeLink = (e) => {
    let videoUrlID = e.target.value
    if(videoUrlID.includes('watch?v=')) {
      videoUrlID = videoUrlID.split('watch?v=')[1].split('&')[0]
    }
    else {
      videoUrlID = videoUrlID.split('be/')[1]
    }
    setYoutubeLink(videoUrlID)
  }

  function clearVideoState() {
    setVideoTitle('')
    setVideoDuration('')
    setVideoUrl('')
    setYoutubeLink('')
  }
  function clearNotestate() {
    setNotesTitle('')
    setNotesText('')
    setNotesFile(null)
    setNotesFileText('')
  }
  
  const createCourse = () => {
    if(createCourseAccess) {
      setDB('courses', newCourseID, {
        category: courseCategory,
        costType: coursePrice > 0 ? 'pro' : 'free',
        courseType,
        cover: courseCover,
        dateCreated: new Date(),
        dateUpdated: new Date(),
        description: courseFullDescript,
        short: courseShortDescript,
        summary: courseSummary,
        difficulty: courseDifficulty,
        featuredCourse: false,
        filterable: true,
        hasCertificate: courseCertificate,
        id: newCourseID,
        instructorID: myUser?.instructorID ?? user?.uid,
        language: courseLang,
        lessonsCount: lessons.length,
        notes: '',
        price: coursePrice,
        studentsEnrolled: 0,
        title: courseTitle,
        totalDuration: 0, 
        whatYouLearn: []
      }).then(() => {
        updateDB('instructors', myUser?.instructorID, {
          'coursesTaught': firebase.firestore.FieldValue.arrayUnion(newCourseID)
        })
        updateDB('admin', 'courseSettings', {
          'coursesCount': firebase.firestore.FieldValue.increment(1)
        })
        lessons.forEach(lesson => {
          const docRef = db.collection('courses').doc(newCourseID).collection('lessons').doc(lesson.lessonID)
          batch.set(docRef, {lessonID: lesson.lessonID, lessonType: 'video', title: lesson.title})
        })
        lessons.forEach(lesson => {
          lesson.videos.forEach(video => {
            const docRef = db.collection('courses').doc(newCourseID).collection('lessons').doc(lesson.lessonID).collection('videos').doc(video.videoID)
            batch.set(docRef, {videoID: video.videoID, title: video.title, duration: video.duration, url: video.url, dateAdded: new Date()})
          })
        })
        lessons.forEach(lesson => {
          lesson.notes.forEach(note => {
            const docRef = db.collection('courses').doc(newCourseID).collection('lessons').doc(lesson.lessonID).collection('notes').doc(note.noteID)
            batch.set(docRef, {noteID: note.noteID, text: note.text, title: note.title, dateAdded: new Date()})
          })
        })
        batch.commit().then(() => {
          window.alert('Course successfully created.')
          history.push(`/courses/course/${newCourseID}`)
        })
        .catch(err => console.log(err))
      })
    }
    else {
      window.alert('Fill in all course details in order to create a course.')
    }
  }
  
  useEffect(() => {
    setNavTitle('Create')
    setNavDescript(`Create ${courseType} course`)
  },[courseType])

  useEffect(() => {
    if(youtubeLink?.length) {
      getYoutubeVideoDetails(youtubeLink)
      .then(res => {
        setVideoTitle(res.data.items[0].snippet.title)
        setVideoDuration(convertYoutubeDuration(res.data.items[0].contentDetails.duration))
        setVideoUrl(`https://youtube.com/watch?v=${youtubeLink}`) 
      })
      .catch(err => console.log(err))
    }
    else {
      console.log('No youtube link provided.')
    }
  },[youtubeLink])

  useEffect(() => {
    getCourseCategories(setCategoriesArr)
  },[])

  useEffect(() => {
    setWindowPadding('100px 0px 30px 30px')
    return () => setWindowPadding('100px 30px 30px 30px')
  },[])

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
              <label className="upload-container" style={{backgroundImage: `url(${courseCover})`, height: courseCover.length ? "300px" : "100px"}}>
                <input 
                  style={{display:'none'}} 
                  type="file" accept='.jpg,.jpeg,.jfif,.png' 
                  onChange={(e) => uploadImgLocal(inputRef, setCourseCover)} 
                  ref={inputRef}
                />
                {!courseCover.length && <i className="fal fa-images"></i>}
              </label>
              <AppInput title="Course Title" onChange={(e) => setCourseTitle(e.target.value)} />
              <AppSelect title="Language" options={languages} onChange={(e) => setCourseLang(e.target.value)} value={courseLang} />
              <AppSelect title="Difficulty" options={difficulties} onChange={(e) => setCourseDifficulty(e.target.value)} value={courseDifficulty} />
              <AppSelect title="Category" options={[{name: 'Choose a Category', value: ""}, ...courseCategoriesOpts]} onChange={(e) => setCourseCategory(e.target.value)} value={courseCategory} />
              <AppInput title="Course Price ($CAD)" type="number" min={0} onChange={(e) => setCoursePrice(e.target.value)} value={coursePrice} />
              <AppTextarea title="Short Description" onChange={(e) => setCourseShortDescript(e.target.value)} value={courseShortDescript} />
              <AppTextarea title="Full Description" onChange={(e) => setCourseFullDescript(e.target.value)} value={courseFullDescript} />
              <AppTextarea title="Course Summary" onChange={(e) => setCourseSummary(e.target.value)} value={courseSummary} />
              <AppSwitch title="Certificate Offered" onChange={(e) => setCourseCertificate(e.target.checked)} checked={courseCertificate} />
              <AppSwitch title="Allow Reviews & Ratings" onChange={(e) => setAllowReviews(e.target.value)} checked={allowReviews} />
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
              actions={<button onClick={() => addEditVideo()}>{editVideoMode.mode ? "Save" : "Add"}</button>}
            >
              <div className="form">
                <AppInput title="Video Title" onChange={(e) => setVideoTitle(e.target.value)} value={videoTitle} />
                <AppInput title="Duration (Format: hh:mm:ss)" onChange={(e) => setVideoDuration(e.target.value)} value={videoDuration} />
                <AppInput title="Video URL" onChange={(e) => {setVideoUrl(e.target.value);setYoutubeLink('')}} value={videoUrl}/>
                { videoUrl && 
                  <label className="commoninput">
                    <h6>Video Preview</h6>
                    <a href={videoUrl} target="_blank" rel="noreferrer">
                      <i className="fas fa-play"></i>
                      Preview
                    </a>
                  </label> 
                }
                <span className="seperator"><hr/>Or auto-detect with YouTube video link<hr/></span>
                <AppInput title="YouTube Video Link" onChange={(e) => convertYoutubeLink(e)} value={youtubeLink}/>
              </div>
            </AppModal>
            <AppModal 
              title="Add Notes"
              showModal={showNotesModal}
              setShowModal={setShowNotesModal}
              actions={<button onClick={() => addEditNotes()}>{editNotesMode.mode ? "Save" : "Add"}</button>}
            >
              <div className="form single-columns">
                <AppInput title="Notes Title" onChange={(e) => setNotesTitle(e.target.value)} value={notesTitle} />
                <AppTextarea title="Notes Text" onChange={(e) => setNotesText(e.target.value)} value={notesText} />
                <label className={`commoninput fileinput ${lesson?.files?.length ? "disabled" : ""}`}>
                    <h6>Add Files {lesson?.files?.length ? "(Only one set of files per lesson)" : ""}</h6>
                    { !lesson?.files?.length &&
                      <input 
                        type="file" multiple 
                        onChange={(e) => handleFileUpload(e)} 
                        accept=".pdf, .docx, .doc, .pptx, .ppt, .xlsx, .xls, .png, .jpg, jpeg, jfif, .mp3, .wav, .zip, .rar" 
                      />
                    }
                    <div className="icon-container">
                      <i className="fal fa-file-pdf"></i>
                      <small>{showNotesFileNum(notesFile?.length)}</small>
                    </div>
                </label>
              </div>
            </AppModal>
          </div>
          <div className={`slide-element ${slidePos === 2 ? "active" : slidePos > 2 ? "prev" : ""}`}>
            <div className="course-review-container">
              <h5 className="create-title">Review Course Details</h5>
              <div className="review-row">
                <h6>Cover Image</h6>
                <span><img src={courseCover} alt="" /></span>
              </div>
              {courseSummaryRender}
              <br/>
              <h5 className="create-title">Course Lessons ({lessons.length})</h5>
              {lessons.length ? lessonsRender : "No Lessons"} 
            </div>
          </div>
        </div>
        <div className="create-nav">
          <button 
            onClick={() => slidePos > 0 && setSlidePos(prev => prev - 1)}
            className={!(slidePos > 0) ? "disable" : ""}
          >Back
          </button>
          { slidePos === 2 &&
            <button 
              className={`create-course-btn ${!lessons.length ? "disabled" : ""} shadow-hover`}  
              onClick={() => createCourse()}
            >
              Create Course
              <i className='fal fa-arrow-right'></i>
            </button>
          }
          <button 
            onClick={() => slidePos < 2 && setSlidePos(prev => prev + 1)}
            className={!(slidePos < 2) ? "disable" : ""}
          >Next
          </button>
        </div>
      </div>
      <div className="side-bar hidescroll">
        <div className='files-container'>
          <h5>Files <span>({totalFilesNum})</span></h5>
          {totalFilesNum> 0 ? courseFilesRender : ""}
        </div>
        <div className='notes-container'>
          <h5>Notes <span>({totalNotesNum})</span></h5>
          {totalNotesNum > 0 ? courseNotesRender : ""}
        </div>
      </div>
    </div>
  )
}
