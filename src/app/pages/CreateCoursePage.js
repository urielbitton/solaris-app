import React, { useContext, useEffect, useRef, useState } from 'react'
import { useRouteMatch } from 'react-router'
import './styles/CreateCoursePage.css'
import noAccessImg from '../assets/imgs/access-img.png'
import {StoreContext} from '../store/store'
import { videoTypes } from '../api/apis'
import { AppInput, AppSelect, AppSwitch, AppTextarea } from '../components/ui/AppInputs'
import { db } from '../firebase/fire'
import LessonCard from '../components/course/LessonCard'
import AppModal from '../components/ui/AppModal'
import { getYoutubeVideoDetails } from '../services/youtubeServices'
import { convertYoutubeDuration, fileTypeConverter, truncateText } from '../utils/utilities'
import { getCourseCategories } from '../services/adminServices'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { CreateCourse, SaveCourse, DeleteCourse } from '../services/CRUDCourse'
import PageLoader from '../components/ui/PageLoader'
import { getCourseByID, getLessonsByCourseID } from "../services/courseServices"
import { deleteStorageFile, uploadImgToFireStorage, uploadMultipleFilesToFireStorage } from "../services/storageServices"
import { updateDB } from "../services/CrudDB"
import FileItem from "../components/course/FileItem"

export default function CreateCoursePage({editMode}) {
 
  const {setNavTitle, setNavDescript, setWindowPadding, myUser, user} = useContext(StoreContext)
  const courseType = useRouteMatch('/create/create-course/:courseType')?.params.courseType
  const courseID = useRouteMatch('/edit-course/:courseID')?.params.courseID
  const [courseTitle, setCourseTitle] = useState('')
  const [courseCover, setCourseCover] = useState('')
  const [coverDisplay, setCoverDisplay] = useState('')
  const [courseLang, setCourseLang] = useState('english')
  const [courseDifficulty, setCourseDifficulty] = useState('easy')
  const [courseCategory, setCourseCategory] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
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
  const [lessonTitleTemp, setLessonTitleTemp] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [videoDuration, setVideoDuration] = useState(0)
  const [videoUrl, setVideoUrl] = useState('')
  const [notesTitle, setNotesTitle] = useState('')
  const [notesText, setNotesText] = useState('')
  const [notesFileText, setNotesFileText] = useState('')
  const [notesFile, setNotesFile] = useState('')
  const [lessonFiles, setLessonFiles] = useState([])
  const [youtubeLink, setYoutubeLink] = useState('')
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [showFilesModal, setShowFilesModal] = useState(false)
  const [showLessonTitleModal, setShowLessonTitleModal] = useState(false)
  const [showLearnElModal, setShowLearnElModal] = useState(false)
  const [editVideoMode, setEditVideoMode] = useState({mode: false, video: {}})
  const [editNotesMode, setEditNotesMode] = useState({mode: false, notes: {}})
  const [editFilesMode, setEditFilesMode] = useState({mode: false, files: {}})
  const [categoriesArr, setCategoriesArr] = useState([])
  const [whatYouLearn, setWhatYouLearn] = useState([])
  const [whatYouLearnText, setWhatYouLearnText] = useState('')
  const [whatYouLearnIndex, setWhatYouLearnIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const newCourseID = db.collection('courses').doc().id
  const inputRef = useRef()
  const scrollTopRef = useRef()
  const history = useHistory()
  // Edit mode states
  const [course, setCourse] = useState({})
  const [courseLessons, setCourseLessons] = useState([])
  const [editLessons, setEditLessons] = useState([])
  const [deletedLessons, setDeletedLessons] = useState([])
  const [repopulateFlag, setRepopulateFlag] = useState(false)
  const totalNotesNum = lessons?.reduce((a,b) => a + b.notes?.length, 0)
  const totalFilesNum = lessons?.reduce((a,b) => a + b.files?.length, 0)
  const courseLessonsNotesNum = courseLessons?.reduce((a,b) => a + b.notes?.length, 0)
  const courseLessonsFilesNum = courseLessons?.reduce((a,b) => a + b.files?.length, 0)
  const createCourseAccess = (!editMode ? lessons.length > 0 : courseLessons.length > 0) && courseTitle.length 
    && courseShortDescript.length
  const isCourseInstructor = editMode && course?.instructorID === myUser?.instructorID
  const canAccessPage = editMode ? (isCourseInstructor || myUser?.isAdmin) : myUser?.isInstructor

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
    {title: 'Course Price', value:  coursePrice > 0 ? `$${coursePrice}` : 'Free'},
    {title: 'Course Description', value: courseShortDescript}
  ]

  const whatYouLearnRender = whatYouLearn?.map((el,i) => {
    return <span key={i} className="list-element">
      <i className="far fa-check"></i>
      <span>
        {el}
        <i className="far fa-pen edit-icon" onClick={() => editLearnElement(el, i)}></i>
        <i className="far fa-trash-alt edit-icon" onClick={() => deleteLearnElement(el)}></i>
      </span>
    </span>
  })
  
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

  const editLearnElement = (el, i) => {
    setWhatYouLearnText(el) 
    setWhatYouLearnIndex(i)
    setShowLearnElModal(true)
  }
  const deleteLearnElement = (el) => {
    const index = whatYouLearn.findIndex(x => x === el)
    whatYouLearn.splice(index, 1)
    setWhatYouLearn(prev => [...prev])
  }
  const saveLearnElement = () => {
    whatYouLearn[whatYouLearnIndex] = whatYouLearnText
    setWhatYouLearnText('')
    setWhatYouLearnIndex(-1)
    setShowLearnElModal(false)
  }
  
  const courseFilesRender = [...lessons, ...courseLessons]?.map((lesson,i) => {
    return <div className='lesson-block'>
      <h5>{lesson.title}</h5>
      { !editMode ?
        lesson?.filesPreview.map((file,j) => { 
          return file.map((file, k) => {
            return <FileItem 
              file={file} 
              deleteClick={() => deleteFile(lesson, file)}
              key={k} 
            />
          })
        }) :
        lesson?.files && Array.isArray(lesson?.files) ? 
        lesson?.files?.map((file,k) => { 
          return <FileItem 
            file={file} 
            customType 
            deleteClick={() => deleteFile(lesson, file)}
            key={k} 
          />
        }) :
        lesson?.files && Array.from(lesson?.files)?.map((file,k) => { 
          return <FileItem 
            file={file} 
            deleteClick={() => deleteFile(lesson, file)}
            key={k} 
          />
        })
      }
    </div>
  }) 
 
  const courseNotesRender = [...lessons, ...courseLessons]?.map((lesson,i) => {
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

  const deleteFile = (lesson, file) => {
    if(editMode) {
      const confirm = window.confirm('Are you sure you want to remove this file')
      if(confirm) {
        db.collection('courses').doc(courseID)
        .collection('lessons').doc(lesson.lessonID)
        .collection('files').doc(file.fileID)
        .delete()
        .then(() => {
          deleteStorageFile(`/courses/${courseID}/lessons/${lesson.lessonID}/files`, file.fileName)
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
    clearNotesState()
  }
  const clickAddFiles = (lesson) => {
    setShowFilesModal(true)
    setEditFilesMode({mode: false, files: {}})
    setLesson(lesson)
    clearFilesState()
  }
  const onVideoClick = (lesson, video) => {
    setSlidePos(1)
    setLesson(lesson)
    setShowVideoModal(true)
    setEditVideoMode({mode: true, video: video})
    setVideoTitle(video.title)
    setVideoDuration(video.duration)
    setVideoUrl(video.url)
  }
  const onNotesClick = (lesson, notes) => {
    setSlidePos(1)
    setLesson(lesson)
    setShowNotesModal(true)
    setEditNotesMode({mode: true, notes: notes})
    setNotesTitle(notes.title)
    setNotesText(notes.text)
  }
  const editLessonTitle = (e, lesson) => {
    e.stopPropagation()
    setSlidePos(1)
    setLesson(lesson)
    setShowLessonTitleModal(true)
    setLessonTitleTemp(lesson.title)
  }
  
  const lessonsRender = [...editLessons, ...lessons]?.map((lesson,i) => {
    return <LessonCard 
      lesson={lesson} 
      courseID={courseID}
      keyword="" 
      createMode 
      editMode={editMode}
      addedVideos={lesson.videos} 
      notes={lesson.notes}
      notOpenVideoPage
      onVideoClick={(video) => onVideoClick(lesson, video)}
      onNotesClick={(notes) => onNotesClick(lesson, notes)}
      courseUserAccess
      maxAccordionHeight={3000}
      initComponent={
        <div className="init-component">
          <h5 onClick={() => clickAddVideo(lesson)}><i className="fas fa-video"></i>Click to add videos to this lesson</h5>
          <h5 onClick={() => clickAddNotes(lesson)}><i className="fas fa-sticky-note"></i>Click to add notes to this lesson</h5>
          <h5 onClick={() => clickAddFiles(lesson)}><i className="fas fa-file"></i>Click to add files to this lesson</h5>
        </div>
      }
      deleteBtn={ 
        <i className="far fa-trash-alt" style={{fontSize:16}} onClick={(e) => deleteLesson(e, lesson)}></i> 
      }
      editBtn={ 
        <i className="far fa-pen" style={{fontSize:16}} onClick={(e) => editLessonTitle(e, lesson)}></i> 
      }
      key={i} 
    />
  }) 

  const handleCoverUpload = (e) => {
    setCourseCover(e)
    const file = e.target.files[0]
    if(file) {
      setCoverDisplay(URL.createObjectURL(file))
    }
  }

  const whatYouLearnEnterPress = (e) => {
    let keyCode = e.code || e.key
    if (keyCode === 'Enter' && (whatYouLearnText.length < 400 && whatYouLearnText.length)) {
      setWhatYouLearn(prev => [...prev, whatYouLearnText])
      setWhatYouLearnText('') 
    }
  }

  const newLessonEnterPress = (e) => {
    let keyCode = e.code || e.key;
    if (keyCode === 'Enter') {
      addLesson()
    }
  }

  const addLesson = () => {
    if(lessonTitle.length) {
      const combinedLessons = [...lessons, ...courseLessons]
      setLessons(prev => 
        [...prev, {
          title: lessonTitle,
          lessonID: db.collection('courses').doc(newCourseID).collection('lessons').doc().id,
          lessonType: courseType,
          videoType,
          order: combinedLessons.length + 1,
          notes: [],
          videos: [],
          files: [],
          filesPreview: []
        }]
      )
      setLessonTitle('')
    }
  }

  const deleteLesson = (e, lesson) => {
    e.stopPropagation()
    setSlidePos(1)
    const confirm = window.confirm('You are about to delete this lesson.')
    if(confirm) {
      if(lessons.findIndex(x => x.lessonID === lesson.lessonID) > -1) {
        const index = lessons.findIndex(x => x.lessonID === lesson.lessonID)
        lessons.splice(index, 1)
      }
      else {
        setDeletedLessons(prev => [...prev, lesson])
        const index = courseLessons.findIndex(x => x.lessonID === lesson.lessonID)
        courseLessons.splice(index, 1)
        setRepopulateFlag(false)
        setCourseLessons(prev => [...prev])
      }
      setLessons(prev => [...prev])
    }
  }

  const saveLessonTitle = () => {
    const index = lessons.findIndex(x => x.lessonID === lesson.lessonID)
    lessons[index].title = lessonTitleTemp
    setLessonTitleTemp('')
    setShowLessonTitleModal(false)
  }

  const addEditVideo = () => {
    if(videoTitle.length && videoUrl.length) {
      if(!editVideoMode.mode) {
        lesson.videos.push({
          title: videoTitle,
          duration: videoDuration,
          url: videoUrl,
          videoID: db.collection('courses').doc(newCourseID).collection('lessons').doc(lesson.lessonID).collection('videos').doc().id,
          dateAdded: new Date(),
          order: lesson.videos.length + 1
        })
      }
      else {
        let videoIndex = lesson.videos?.findIndex(x => x.videoID === editVideoMode.video.videoID)
        lesson.videos[videoIndex] = {
          ...lesson.videos[videoIndex],
          title: videoTitle,
          duration: videoDuration,
          url: videoUrl,
          videoID: lesson.videos[videoIndex]?.videoID,
          dateAdded: new Date()
        }
      }
      clearVideoState()
      setShowVideoModal(false) 
    }
    else {
      window.alert('Please enter a video URL and title to proceed.')
    }
  }

  const addEditNotes = () => {
    if(notesTitle.length) { 
      if(!editNotesMode.mode) {
        lesson.notes.push({
          title: notesTitle,
          text: notesText,
          dateAdded: new Date(),
          noteID: db.collection('courses').doc(newCourseID).collection('lessons').doc(lesson.lessonID).collection('notes').doc().id,
          order: lesson.notes.length + 1
        })
      }
      else {
        let notesIndex = lesson.notes.findIndex(x => x.noteID === editNotesMode.notes.noteID)
        lesson.notes[notesIndex] = {
          ...lesson.notes[notesIndex],
          title: notesTitle,
          text: notesText,
          noteID: lesson.notes[notesIndex]?.noteID,
          dateAdded: new Date()
        }
      }
      clearNotesState()
      setShowNotesModal(false)
    }
  }

  const addEditFiles = () => {
    if(notesFile) {
      lesson.files = lessonFiles
      lesson.filesPreview.push([...notesFile])
      setShowFilesModal(false)
    }
  }

  const deleteVideo = () => {
    const index = lesson.videos.findIndex(x => x.videoID === editVideoMode.video.videoID)
    lesson.videos.splice(index, 1)
    setShowVideoModal(false)
  }
  const deleteNote = () => {
    const index = lesson.notes.findIndex(x => x.noteID === editNotesMode.notes.noteID)
    lesson.notes.splice(index, 1)
    setShowNotesModal(false)
  }
  const deleteFiles = () => {
    lesson.files = []
    lesson.filesPreview = []
    setRepopulateFlag(false)
    setCourseLessons(prev => [...prev])
  }
  
  const handleFileUpload = (e) => {
    setNotesFileText(e.target.value)
    setNotesFile(e.target.files)
    setLessonFiles(e.target.files)
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
  function clearNotesState() {
    setNotesTitle('')
    setNotesText('')
  }
  function clearFilesState() {
    setNotesFileText('')
    setNotesFile(null)
  }

  const repopulateCourseLessonsFromDB = () => {
    if(repopulateFlag) {
      courseLessons.forEach(lesson => {
        lesson['videos'] = []
        lesson['notes'] = []
        lesson['files'] = []
        lesson['filesPreview'] = [] 
        //repopulate videos docs
        db.collection('courses').doc(courseID)
        .collection('lessons').doc(lesson.lessonID)
        .collection('videos').onSnapshot(videoDocs => {
          videoDocs.forEach(doc => {
            lesson['videos'].push(doc.data())
          })
        })
        //repopulate notes docs
        db.collection('courses').doc(courseID)
        .collection('lessons').doc(lesson.lessonID)
        .collection('notes').onSnapshot(notesDocs => {
          notesDocs.forEach(doc => {
            lesson['notes'].push(doc.data())
          })
        })
        db.collection('courses').doc(courseID)
        .collection('lessons').doc(lesson.lessonID)
        .collection('files').onSnapshot(fileDocs => {
          fileDocs.forEach(doc => {
            if(Array.isArray(lesson?.files)) {
              lesson?.files?.push(doc.data())
              lesson?.filesPreview?.push(doc.data())
            }
          })
        })
      })
      setEditLessons(courseLessons)
    }
  }

  const createCourse = () => {
    if(createCourseAccess) {
      setRepopulateFlag(false)
      setLoading(true)
      const courseObject = {
        allowReviews,
        category: courseCategory,
        costType: coursePrice > 0 ? 'pro' : 'free',
        courseType: courseType ?? 'video',
        cover: courseCover.length ? courseCover : "https://i.imgur.com/aRXh4Z6.png",
        dateCreated: !editMode ? new Date() : course.dateCreated,
        dateUpdated: new Date(),
        description: courseFullDescript,
        difficulty: courseDifficulty,
        featuredCourse: !editMode ? false : course.featuredCourse,
        firstVideoID: !editMode ? lessons[0]?.videos[0].videoID ?? '' : courseLessons[0]?.videos[0].videoID,
        firstLessonID: !editMode ? lessons[0]?.lessonID ?? "" : courseLessons[0]?.lessonID ?? "",
        hasCertificate: courseCertificate,
        id: !editMode ? newCourseID : courseID,
        instructorID: !editMode ? myUser?.instructorID ?? user?.uid : course?.instructorID,
        instructorName: !editMode ? user?.displayName : course?.instructorName,
        language: courseLang,
        lessonsCount: !editMode ? lessons.length : courseLessons.length,
        notes: '',
        numberOfReviews: !editMode ? 0 : course.numberOfReviews,
        price: +coursePrice,
        rating: 0,
        short: courseShortDescript,
        summary: courseSummary,
        studentsEnrolled: !editMode ? 0 : course.studentsEnrolled,
        title: courseTitle,
        totalDuration: 0, 
        whatYouLearn
      }
      if(!editMode) {
        CreateCourse(newCourseID, lessons, myUser, courseObject)
        .then(() => {
          uploadImgToFireStorage(
            courseCover, 
            `/courses/${newCourseID}/cover`, 
            'cover-img'
          )
          .then(url => {
            updateDB('courses', newCourseID, {
              cover: url
            })
            .then(() => {
              setLoading(false)
              history.push(`/courses/course/${newCourseID}`)
            })
            .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
          new Promise((resolve, reject) => {
            lessons.forEach((lesson,i) => {
              if(lesson.files.length) {
                uploadMultipleFilesToFireStorage(
                  lesson.files, 
                  `/courses/${newCourseID}/lessons/${lesson.lessonID}/files`,
                  `/courses/${newCourseID}/lessons/${lesson.lessonID}/files`
                )
                .then(() => {
                  if(i === lessons.length-1) {
                    resolve()
                    setLoading(false)
                  }
                  setLoading(false)
                })
                .catch(err => {
                  console.log(err)
                  setLoading(false)
                  reject()
                })
              }
            })
          })
          .then(() => {
            setLoading(false)
          })
          .catch(err => {
            console.log(err)
            setLoading(false)
          })
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
      }
      else {
        SaveCourse(courseID, [...courseLessons, ...lessons], courseObject, deletedLessons)
        .then(() => {
          if(courseCover.target) { //if course cover was uploaded via onChange
            uploadImgToFireStorage(
              courseCover, 
              `/courses/${courseID}/cover`, 
              'cover-img'
            )
            .then(url => {
              updateDB('courses', courseID, {
                cover: url
              })
              .then(() => {
                setLoading(false)
                history.push(`/courses/course/${courseID}`)
              })
              .catch(err => {
                console.log(err)
                setLoading(false)
              })
            })
            .catch(err => {
              console.log(err)
              setLoading(false)
            })
          }
          else {
            setLoading(false)
            history.push(`/courses/course/${courseID}`)
          }
          const combinedLessons = [...courseLessons, ...lessons]
            new Promise((resolve, reject) => {
              combinedLessons.forEach((lesson,i) => {
                if(lesson.files.length) {
                  uploadMultipleFilesToFireStorage(
                    lesson.files, 
                    `/courses/${courseID}/lessons/${lesson.lessonID}/files`,
                    `/courses/${courseID}/lessons/${lesson.lessonID}/files`
                  )
                  .then(() => {
                    if(i === combinedLessons.length-1) {
                      resolve()
                      setLoading(false)
                    }
                    setLoading(false)
                  })
                  .catch(err => {
                    console.log(err)
                    setLoading(false)
                    reject()
                  })
                }
              })
            })
            .then(() => {
              setLoading(false)
            })
            .catch(err => {
              console.log(err)
              setLoading(false)
            })
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })
      }
    }
    else {
      window.alert('Fill in all course details in order to create a course.')
    }
  }

  const deleteCurrentCourse = () => {
    if(editMode) {
      const confirm = window.confirm('Are you sure you would like to remove this course?')
      if(confirm) {
        setLoading(true)
        DeleteCourse(courseID, myUser)
        .then(res => {
          window.alert('The course has been removed.')
          setLoading(false)
        })
        history.push('/courses')
      }
    }
  }
  
  useEffect(() => {
    setNavTitle(!editMode ? 'Create' : 'Edit Course')
    setNavDescript(!editMode ? `Create ${courseType} course` : '')
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
    setWindowPadding('100px 0px 0px 30px')
    return () => setWindowPadding('100px 30px 0px 30px')
  },[])

  useEffect(() => {
    scrollTopRef?.current?.scroll({top:0, behavior:'smooth'})
  },[slidePos])

  useEffect(() => {
    getCourseByID(courseID, setCourse)
    if(editMode) {
      getLessonsByCourseID(courseID, setCourseLessons)
      setRepopulateFlag(true)
    }
  },[courseID])

  useEffect(() => {
    if(editMode && repopulateFlag) {
      repopulateCourseLessonsFromDB() 
      setRepopulateFlag(false)
    }
  },[courseLessons])  

  useEffect(() => {
    if(!showLearnElModal) {
      setWhatYouLearnText('')
    }
  },[showLearnElModal])

  useEffect(() => {
    if(editMode) {
      setCourseTitle(course.title)
      setVideoType('youtube')
      setCoverDisplay(course.cover)
      setCourseCover(course.cover)
      setCourseLang(course.language)
      setCourseDifficulty(course.difficulty)
      setCourseCategory(course.category)
      setCoursePrice(course.price)
      setCourseShortDescript(course.short)
      setCourseSummary(course.summary)
      setCourseFullDescript(course.description)
      setCourseCertificate(course.hasCertificate)
      setAllowReviews(course.allowReviews)
      setWhatYouLearn(course.whatYouLearn)
    }
  },[course])

  return (
    canAccessPage ?
      <div className="create-course-page">
        <div className="create-content">
        <div className="create-content-titles">
          <h3>{!editMode ? "Create" : "Edit"} {!editMode ? courseType : course?.courseType} Course</h3>
          <div>
            { 
              editMode && <button 
                  className={`save-course-btn ${!courseLessons.length ? "disabled" : ""}`}  
                  onClick={() => createCourse()}
                >
                  Save Course
              </button> 
            }
            { editMode && <button className="delete" onClick={() => setShowDeleteModal(true)}>Delete Course</button> }
          </div>
        </div>
        <div className="slide-container" ref={scrollTopRef}>
          <div className={`slide-element ${slidePos === 0 ? "active" : slidePos > 0 ? "prev" : ""}`}>
            <div className="video-type-container">
              <h5 className="create-title">Choose a video type</h5>
              {videoTypesRender}
            </div>
            <div className="course-info">
            <h5 className="create-title">Course Information</h5>
              <h6>Cover Image</h6>
              <label  
                className={`upload-container ${coverDisplay?.length ? 'has-img' : ''}`} 
                style={{backgroundImage: `url(${coverDisplay})`, height: coverDisplay?.length ? "300px" : "120px"}}
                onChange={(e) => handleCoverUpload(e)} 
              >
                {
                  coverDisplay?.length ?
                  <div className="upload-cover">
                    <h4>Click here to change cover image</h4>
                  </div> :
                  <></>
                }
                <input 
                  style={{display:'none'}} 
                  type="file" accept='.jpg,.jpeg,.jfif,.png' 
                  ref={inputRef}
                />
                {!coverDisplay?.length && <i className="fal fa-images"></i>}
              </label>
              <AppInput title="Course Title" onChange={(e) => setCourseTitle(e.target.value)} value={courseTitle} />
              <AppSelect title="Language" options={languages} onChange={(e) => setCourseLang(e.target.value)} value={courseLang} />
              <AppSelect title="Difficulty" options={difficulties} onChange={(e) => setCourseDifficulty(e.target.value)} value={courseDifficulty} />
              <AppSelect title="Category" options={[{name: 'Choose a Category', value: ""}, ...courseCategoriesOpts]} onChange={(e) => setCourseCategory(e.target.value)} value={courseCategory} />
              <AppInput title="Course Price (CAD)" type="number" min={0} onChange={(e) => setCoursePrice(e.target.value)} value={coursePrice} />
              <AppTextarea title="Short Description" onChange={(e) => setCourseShortDescript(e.target.value)} value={courseShortDescript} />
              <AppTextarea title="Full Description" onChange={(e) => setCourseFullDescript(e.target.value)} value={courseFullDescript} />
              <AppTextarea title="Course Summary" onChange={(e) => setCourseSummary(e.target.value)} value={courseSummary} />
              <div className="what-you-learn-section">
                <h6>What you will learn in this course</h6>
                {whatYouLearnRender}
                <div style={{marginBottom: 40}}>
                  <AppInput 
                    placeholder="Add a learning element...(press enter to save)"
                    onChange={(e) => setWhatYouLearnText(e.target.value)} 
                    value={whatYouLearnText} 
                    onKeyPress={(e) => whatYouLearnEnterPress(e)}
                  />
                  <small>*400 characters max</small>
                </div>
              </div>
              <AppSwitch title="Certificate Offered" onChange={(e) => setCourseCertificate(e.target.checked)} checked={courseCertificate} />
              <AppSwitch title="Allow Reviews & Ratings" onChange={(e) => setAllowReviews(e.target.checked)} checked={allowReviews} />
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
              actions={<>
                <button onClick={() => addEditVideo()}>{editVideoMode.mode ? "Save" : "Add"}</button>
                {editVideoMode.mode && <button className="delete-btn" onClick={() => deleteVideo()}>Delete</button>}
              </>
              }
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
              actions={<>
                <button onClick={() => addEditNotes()}>{editNotesMode.mode ? "Save" : "Add"}</button>
                <button className="delete-btn" onClick={() => deleteNote()}>Delete</button>
              </>}
            >
              <div className="form single-columns">
                <AppInput title="Notes Title" onChange={(e) => setNotesTitle(e.target.value)} value={notesTitle} />
                <AppTextarea title="Notes Text" onChange={(e) => setNotesText(e.target.value)} value={notesText} />
              </div>
            </AppModal>
            <AppModal 
              title="Add Files"
              showModal={showFilesModal}
              setShowModal={setShowFilesModal}
              actions={<>
                <button onClick={() => addEditFiles()}>{editFilesMode.mode ? "Save" : "Add"}</button>
                <button className="delete-btn" onClick={() => deleteFiles()}>Delete</button>
              </>}
            >
              <div className="form single-columns">
                <label className={`commoninput fileinput`}>
                    <h6>Add Files {lesson?.filesPreview?.length ? "(Only one set of files per lesson)" : ""}</h6>
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
          <div className={`slide-element ${slidePos === 2 ? "active" : slidePos > 2 ? "prev" : ""}`}>
            <div className="course-review-container">
              <h5 className="create-title">Review Course Details</h5>
              <div className="review-row">
                <h6>Cover Image</h6>
                <span><img src={coverDisplay} alt="" /></span>
              </div>
              {courseSummaryRender}
              <br/>
              <h5 className="create-title">Course Lessons ({!editMode ? lessons.length : courseLessons.length})</h5>
              {(!editMode ? lessons.length : courseLessons.length) ? lessonsRender : "No Lessons"} 
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
              className={`create-course-btn ${!editMode ? !lessons.length ? "disabled" : "" : !courseLessons.length ? "disabled" : ""} shadow-hover`}  
              onClick={() => createCourse()}
            >
              { !editMode ? "Create Course" : "Save Course" }
              <i className={!editMode ? 'fal fa-arrow-right' : 'fal fa-save'}></i>
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
            <h5>Files <span>({courseLessonsFilesNum})</span></h5>
            {courseFilesRender}
          </div>
          <div className='notes-container'>
            <h5>Notes <span>({courseLessonsNotesNum})</span></h5>
            {courseNotesRender}
          </div>
        </div>
        <PageLoader loading={loading} />
        <AppModal 
          title="Edit Lesson Title"
          showModal={showLessonTitleModal}
          setShowModal={setShowLessonTitleModal}
          actions={<button onClick={() => saveLessonTitle()}>Save</button>}
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <AppInput title="Notes Title" onChange={(e) => setLessonTitleTemp(e.target.value)} value={lessonTitleTemp} />
          </form>
        </AppModal>
        <AppModal
          title="Edit Element"
          showModal={showLearnElModal}
          setShowModal={setShowLearnElModal}
          actions={ <button onClick={() => saveLearnElement()}>Save</button> }
        >
          <form onSubmit={(e) =>e.preventDefault()}>
            <AppInput 
              placeholder="Edit learning element" 
              onChange={(e) => setWhatYouLearnText(e.target.value)} 
              value={whatYouLearnText} 
            />
          </form>
        </AppModal> 
        <AppModal 
          title="Confirm Course Deletion"
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
          actions={<>
            <button 
              onClick={() => deleteCurrentCourse()}
              disabled={deleteInput !== course?.title}
            >Delete</button>
          </>}
        >
          <div className="form single-columns">
            <AppInput 
              title={`Enter course name to confirm: ${course?.title}`} 
              onChange={(e) => setDeleteInput(e.target.value)}
            />
          </div>
        </AppModal>
      </div> :
      <div className="no-access-container">
        <img src={noAccessImg} alt=""/>
        <h3>You do not have access to edit this page</h3>
        <button onClick={() => history.push('/')} className="shadow-hover">Return Home</button>
      </div>
  )
}
