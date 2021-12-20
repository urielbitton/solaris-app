import React, { useContext, useEffect, useState } from 'react'
import './styles/BecomeInstructor.css'
import { StoreContext } from '../store/store'
import SlideContainer from '../components/SlideContainer'
import becomeInstructorImg from '../assets/imgs/become-instructor.png'
import SlideElement from '../components/SlideElement'
import { AppInput } from '../components/AppInputs'

export default function BecomeInstructor() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)
  const [slidePosition, setSlidePosition] = useState(0)
  const [coverMessage, setCoverMessage] = useState('Become an instructor on Solaris!')
  const [slidesLength, setSlidesLength] = useState(3)

  const featuresList = [
    {name: 'Upload unlimited course material for free'},
    {name: 'Gain followers when students enroll in your courses'},
    {name: 'Expose your social media profiles to users'},
    {name: 'Teach from the confort of your home, online or in-person'},
    {name: 'Get access to a wide selection of exclusive courses'},
    {name: 'Get one year of pro membership for free'},
  ]

  const featuresListRender = featuresList?.map((feat, i) => {
    return <span className="list-element">
      <i className="fal fa-check"></i>
      {feat.name}
    </span>
  })

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
          <button onClick={() => slidePosition < slidesLength && setSlidePosition(prev => prev + 1)}>Next</button>
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
        >
          Slide 2
        </SlideElement>
        <SlideElement
          slidePosition={slidePosition}
          index={2}
        >
          Slide 3
        </SlideElement>
      </SlideContainer>
    </div>
  )
}
