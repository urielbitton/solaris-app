import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import { getCourseByID } from '../services/courseServices'
import { StoreContext } from '../store/store'
import './styles/Checkout.css'
import { PayPalButton } from 'react-paypal-button-v2'
import { AppInput } from '../components/ui/AppInputs'
import { db } from '../firebase/fire'
import CreateOrder from '../services/CreateOrder'
import { setSubDB, updateDB } from '../services/CrudDB'
import PageLoader from '../components/ui/PageLoader'
import firebase from 'firebase'

export default function CourseCheckout() {

  const {setNavTitle, setNavDescript, user} = useContext(StoreContext)
  const [course, setCourse] = useState({})
  const courseID = useRouteMatch('/checkout/course/:courseID')?.params.courseID
  const clientId = "ASTQpkv9Y3mQ5-YBd20q0jMb9-SJr_TvUl_nhXu5h3C7xl0wumYgdqpSYIL6Vd__56oB7Slag0n2HA_r"
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
  const allowPurchase = validateEmail(email) && address.length && city.length && region.length && country.length && postCode.length
  const freeCourse = course.price === 0
  const history = useHistory()

  const processOrder = () => {
    setLoading(true)
    const orderId = db.collection("orders").doc().id;
    const orderNumber = `${db.collection('orders').doc().id.slice(0,3)}-${db.collection('orders').doc().id.slice(0,7)}`
    const customer = {
      userID: user?.uid,
      name: user.displayName,
      email,
      company,
      address,
      city, 
      region,
      country,
      postalCode: postCode,
      phone
    }
    CreateOrder(orderId, orderNumber, customer, totalPrice)
    .then(res => {
      updateDB('courses', courseID, {studentsEnrolled: firebase.firestore.fieldValue.increment(1)})
      setSubDB('courses', courseID, 'students', user?.uid, {userID: user?.uid, name: user?.displayName})
      setSubDB('users', user?.uid, 'coursesEnrolled', courseID, {
        courseID,
        name: course?.title
      }).then(() => {
        setLoading(false)
        window.alert(`Payment successful. You have been enrolled in the course "${course?.title}".`)
        history.push(`/courses/course/${courseID}`)
      })
      
    }).catch(err => {
      setLoading(false)
      console.log(err)
    })
  }

  function validateEmail(email) {
    return String(email).toLowerCase()
    .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  };

  useEffect(() => {
    getCourseByID(courseID, setCourse)
  },[courseID])

  useEffect(() => {
    setNavTitle('Checkout')
    setNavDescript('Course: ' + course.title + ` - $${course.price}`)
  },[course])

  return (
    <div className="checkout-page">
      <div className="side">
        <h3>Course Checkout</h3>
        <h5>{freeCourse ? "Free Course" : "Billing Details"}</h5>
        <form onSubmit={(e) => e.preventDefault()} style={{display: freeCourse ? "none": "grid"}}>
          <AppInput placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} value={email} />
          <AppInput placeholder="Company Name" onChange={(e) => setCompany(e.target.value)} value={company} />
          <AppInput placeholder="Address" onChange={(e) => setAddress(e.target.value)} value={address} />
          <AppInput placeholder="City" onChange={(e) => setCity(e.target.value)} value={city} />
          <AppInput placeholder="Region" onChange={(e) => setRegion(e.target.value)} value={region} />
          <AppInput placeholder="Country" onChange={(e) => setCountry(e.target.value)} value={country} />
          <AppInput placeholder="Postal Code/ZIP" onChange={(e) => setPostCode(e.target.value)} value={postCode} />
          <AppInput placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} value={phone} />
        </form>
          { !freeCourse ?
          <div className={!!!allowPurchase ? "paypal-container no-access" : "paypal-container"}>
            <PayPalButton
              amount={0.01}
              onSuccess={(details, data) => processOrder()}
              onError={() => window.alert("The transaction was not successful, please try again later.")}
              options={{ clientId }}
            /> 
          </div>:
          <button className="free-enroll-btn shadow-hover" onClick={() => processOrder()}>Enroll Course</button>
          }
      </div>
      <div className="side">
        <h3 style={{visibility:'hidden'}}>.</h3>
        <h5>My Order</h5>
        <div className="items-section">
          <div className="items-row">
            <div className="left">
              <div className="img-container">
                <img src={course.cover} alt="course"/>
              </div>
              <div className="titles">
                <h4>{course.title}</h4>
                <h5>{course.lessonsCount} lesson{course.lessonsCount !== 1 ? "s" : ""}</h5>
              </div>
            </div>
            <div className="right">
              <h6>{coursePrice} CAD</h6>
            </div>
          </div>
        </div>
        <div className="promo-container">
          <h5>Enter promo code</h5>
          <AppInput placeholder="Code here"/>
        </div>
        <div className="totals-container">
          <div>
            <h6>Discount</h6>
            <span>$0.00</span>
          </div>
          <div>
            <h6>Subtotal</h6>
            <span>{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(course.price)}</span>
          </div>
          <div className="total">
            <h6>Total</h6>
            <span>{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(totalPrice)}</span>
          </div>
        </div>
      </div>
          <PageLoader loading={loading} />
    </div>
  )
}
