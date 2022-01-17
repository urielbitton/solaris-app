import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from "../../store/store"
import { AppInput, AppSwitch } from '../ui/AppInputs'
import { updateDB } from '../../services/CrudDB'

export default function MyAccountHome(props) {

  const {setNavTitle, setNavDescript, myUser} = useContext(StoreContext)
  const { setLoading } = props
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [country, setCountry] = useState('')
  const [postCode, setPostCode] = useState('')
  const [companyName, setCompanyName] = useState('')
  const isInstructor = myUser?.isInstructor

  const saveInfo = () => {
    if(firstName.length && lastName.length && email.length) {
      setLoading(true)
      const infoObject = {
        firstName,
        lastName,
        email,
        phone, 
        address, 
        city,
        region,
        country,
        postCode,
        companyName
      }
      updateDB('users', myUser?.userID, infoObject)
      .then(() => {
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
      })
    }
    else {
      window.alert('Your name and email must be filled out to save this section.')
    }
  }

  useEffect(() => {
    setFirstName(myUser?.firstName)
    setLastName(myUser?.lastName)
    setEmail(myUser?.email)
    setPhone(myUser?.phone)
    setAddress(myUser?.address)
    setCity(myUser?.city)
    setRegion(myUser?.region)
    setCountry(myUser?.country)
    setPostCode(myUser?.postCode)
    setCompanyName(myUser?.companyName)
  },[myUser])

  useEffect(() => {
    setNavTitle('My Account')
    setNavDescript('')
  },[])

  return (
    <div className="my-account-home">
      <section>
        <h4>Account Info</h4>
        <AppInput 
          title="First Name"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
        />
        <AppInput 
          title="Last Name"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
        />
        <AppInput 
          title="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <AppInput 
          title="Phone"
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
        />
        <AppInput 
          title="Address"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />
        <AppInput 
          title="City"
          onChange={(e) => setCity(e.target.value)}
          value={city}
        />
        <AppInput 
          title="Region"
          onChange={(e) => setRegion(e.target.value)}
          value={region}
        />
        <AppInput 
          title="Country"
          onChange={(e) => setCountry(e.target.value)}
          value={country}
        />
        <AppInput 
          title="Postal Code/ZIP"
          onChange={(e) => setPostCode(e.target.value)}
          value={postCode}
        />
        <AppInput 
          title="Company Name"
          onChange={(e) => setCompanyName(e.target.value)}
          value={companyName}
        />
      </section>
      <section>
        <h4>Member Account</h4>
        <AppInput 
          title="User ID"
          value={myUser?.userID}
        />
        <AppSwitch 
          title="Pro Member"
          onChange={() => null}
          checked={myUser?.isProMember}
        />
      </section>
      {
        isInstructor ?
        <section>
          <h4>Instructor Info</h4>
          <AppInput 
            title="Instructor ID"
            value={myUser?.instructorID}
          />
        </section> :
        ""
      }
      <footer>
        <button 
          className="shadow-hover"
          onClick={() => saveInfo()}
        >Save</button>
      </footer>
    </div>
  )
}
