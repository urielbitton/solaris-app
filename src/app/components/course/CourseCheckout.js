import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { getCourseByID } from '../services/courseServices'
import { StoreContext } from '../store/store'


export default function CheckoutPage() {

  const {setNavTitle, setNavDescript, user} = useContext(StoreContext)
  const [course, setCourse] = useState({})
  const courseID = useRouteMatch('/checkout/course/:courseID')?.params.courseID
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [country,setCountry] = useState('')
  const [postCode, setPostCode] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const coursePrice = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(course.price)
  const totalPrice = (course.price * 0.15) + course.price
  const freeCourse = course.price === 0
  const history = useHistory()

  
  useEffect(() => {
    getCourseByID(courseID, setCourse)
  },[courseID])

  useEffect(() => {
    setNavTitle('Checkout')
    setNavDescript('Course: ' + course.title + ` - $${course.price}`)
  },[course])

  return (
    <CheckoutPage 
      type="course"
    />
  )
}
