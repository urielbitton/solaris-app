import React, { useContext, useEffect, useState } from 'react'
import './styles/BecomeInstructor.css'
import { StoreContext } from '../store/store'
import SlideContainer from '../components/ui/SlideContainer'
import becomeInstructorImg from '../assets/imgs/become-instructor.png'
import SlideElement from '../components/ui/SlideElement'
import { AppInput, AppSelect, AppSwitch, AppTextarea } from '../components/ui/AppInputs'
import { getCourseCategories } from '../services/adminServices'
import PageLoader from '../components/ui/PageLoader'
import { setDB } from '../services/CrudDB'
import { db } from "../firebase/fire"
import { useHistory } from "react-router-dom"

export default function BecomeInstructor() {

  const { setNavTitle, setNavDescript, user } = useContext(StoreContext)
  const [slidePosition, setSlidePosition] = useState(0)
  const [coverMessage, setCoverMessage] = useState('Become an instructor on Solaris!')
  const [slidesLength, setSlidesLength] = useState(3)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [category, setCategory] = useState('')
  const [categoriesArr, setCategoriesArr] = useState([])
  const [resume, setResume] = useState({})
  const [yearsExperience, setYearsExperience] = useState(0)
  const [isCertified, setIsCertified] = useState(false)
  const [reasonsToApply, setReasonsToApply] = useState('')
  const [bio, setBio] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [endMessage, setEndMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const applicationAccess = firstName.length && lastName.length && category.length && resume.length
    && yearsExperience.length && reasonsToApply.length && bio.length
  const history = useHistory()

  const featuresList = [
    {name: 'Upload unlimited course material for free'},
    {name: 'Gain followers when students enroll in your courses'},
    {name: 'Expose your social media profiles to users'},
    {name: 'Teach from the comfort of your home, online or in-person'},
    {name: 'Get access to a wide selection of exclusive courses'},
    {name: 'Get one year of pro membership for free'},
  ]

  const featuresListRender = featuresList?.map((feat, i) => {
    return <span className="list-element">
      <i className="fal fa-check"></i>
      {feat.name}
    </span>
  })

  const categoriesOptions = categoriesArr?.map((cat, i) => {
    return {name: cat.name, value: cat.value}
  })
  console.log(user?.email)
  const submitApplication = () => {
    if(applicationAccess) {
      setIsLoading(true)
      const docID = db.collection('instructorApplications').doc().id
      setDB('instructorApplications', docID, {
        applicationID: docID,
        dateCreated: new Date(),
        userID: user?.uid,
        name: `${firstName} ${lastName}`,
        email: user?.email,
        preferredCategory: category,
        resume: '',
        yearsOfExperience: yearsExperience,
        hasCertification: isCertified,
        reasonsToApply,
        bio
      })
      .then(res => {        
        setIsLoading(false)
        setEndMessage('Your application was successfully submitted. You will receive a confirmation ' +
        'email shortly and our team will be in touch to review your application.')
        setIsSuccess(true)
        setSlidePosition(3)
      })
      .catch(err => {
        console.log(err)
        setEndMessage('Seems like there was an error submitting your application. Please try again later.')
        setIsSuccess(false)
        setIsLoading(false)
      })
    }
    else {
      window.alert('Please fill out all the required fields to submit the application.')
    }
  }

  useEffect(() => {
    getCourseCategories(setCategoriesArr)
  },[])

  useEffect(() => {
    setNavTitle('Become An Instructor')
    setNavDescript('')
  },[])

  return (
    <div className="become-instructor-page">
      <div className="cover-side">
        <img src={becomeInstructorImg} alt="" />
        <h3>{coverMessage}</h3>
        <div className="blob">
          <div/>
        </div>
        <div className="slide-navigator">
          <button onClick={() => slidePosition > 0 && setSlidePosition(prev => prev - 1)}>Back</button>
          <button onClick={() => slidePosition < slidesLength-1 && setSlidePosition(prev => prev + 1)}>Next</button>
        </div>
      </div>
      <SlideContainer>
        <SlideElement
          slidePosition={slidePosition}
          index={0}
          className="intro-slide"
        >
          <h4>Want to become an Instructor?</h4>
          <h6>Features</h6>
          <div className="list-element-container">
            {featuresListRender}
          </div>
          <button onClick={() => setSlidePosition(prev => prev + 1)} className="shadow-hover">Get Started</button>
        </SlideElement>
        <SlideElement
          slidePosition={slidePosition}
          index={1}
          className="slide-other"
        >
          <h4>Tell us a little about you and your professional experience</h4>
          <form onSubmit={(e) => e.preventDefault()}>
            <AppInput 
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              type="First Name"
            />
            <AppInput 
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              type="Last Name"
            />
            <AppSelect 
              options={[{name: "Choose your preferred course category", value: ''},...categoriesOptions]}
              onChange={(e) => setCategory(e.target.value)}
              className="full"
              namebased
            />
            <AppInput 
              placeholder="Years of Teaching Experience"
              onChange={(e) => setYearsExperience(e.target.value)}
              type="number"
              min={1}
              max={100}
              className="full"
            />
            <AppSwitch 
              title="Do you possess a teaching certification/diploma"
              onChange={(e) => setIsCertified(e.target.checked)}
              checked={isCertified}
              className="full"
            />
            <AppInput 
              title="Upload Your Resume"
              type="file"
              accept=".pdf, .docx, .doc" 
              className="full"
              onChange={(e) => setResume(e.target.value)}
            />
            <div className="button-group">
              <button 
                className="shadow-hover back-btn" 
                onClick={() => setSlidePosition(0)}
              >
                <i className="fal fa-arrow-left"></i>
                Back
              </button>
              <button 
                className="shadow-hover" 
                onClick={() => setSlidePosition(2)}
              >
                Next
                <i className="fal fa-arrow-right"></i>
              </button>
            </div>
          </form>
        </SlideElement>
        <SlideElement
          slidePosition={slidePosition}
          index={2}
          className="slide-other"
        >
          <h4>Finally, share your reasons for applying as an instructor</h4>
          <form onSubmit={(e) => e.preventDefault()}>
            <AppTextarea 
              placeholder="Reasons for applying"
              onChange={(e) => setReasonsToApply(e.target.value)}
              className="full"
            />
            <AppTextarea 
              placeholder="Short Bio"
              onChange={(e) => setBio(e.target.value)}
              className="full"
            />
            <div className="button-group">
              <button 
                className="shadow-hover back-btn" 
                onClick={() => setSlidePosition(1)}
              >
                <i className="fal fa-arrow-left"></i>
                Back
              </button>
              <button 
                className="shadow-hover" 
                onClick={() => submitApplication()}
              >
                Submit
              </button>
            </div>
          </form>
        </SlideElement>
        <SlideElement
          slidePosition={slidePosition}
          index={3}
          className="slide-end"
        >
          <i 
            className={isSuccess ? "far fa-check-circle" : "far fa-exclamation-circle"}
            style={{color: isSuccess ? "var(--green)" : "var(--red)"}}
          ></i>
          <h4>{endMessage}</h4>
          <button onClick={() => history.push('/')}>Back Home</button>
        </SlideElement>
      </SlideContainer>
      <PageLoader loading={isLoading} />
    </div>
  )
}
