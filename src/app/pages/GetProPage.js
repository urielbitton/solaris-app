import React, { useContext, useEffect } from 'react'
import './styles/GetProPage.css'
import { StoreContext } from '../store/store'
import getProImg from '../assets/imgs/get-pro-bg.png'
import { proFeatures } from "../api/apis"
import { useHistory } from "react-router-dom"

export default function GetProPage() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)
  const history = useHistory()

  const featuresList = [
    'Get access to all courses and exclusive courses only available to pro memberships',
    '30 day money back guarantee',
    'Cancel anytime',
    'Custom video platform for instructors'
  ]

  const featuresListRender = featuresList?.map((feat, i) => {
    return <li>
      <i className="fal fa-check"></i>
      {feat}
    </li>
  })

  const featuresRender = proFeatures?.map((feature, i) => {
    return <div className="feature-column" key={i}>
      <img src={feature.img} alt={feature.name}/>
      <h4>{feature.name}</h4>
      <small>{feature.description}</small>
    </div>
  })

  useEffect(() => {
    setNavTitle('Get Pro')
    setNavDescript('Upgrade to an all-access membership')
  },[])

  return (
    <div className="get-pro-page">
      <div className="banner">
        <div className="text-container">
          <h1>All-access Membership</h1>
          <p>By upgrading your membership to pro, take advantage of site-wide free courses, resources and more.</p>
          <button 
            className="shadow-hover"
            onClick={() => history.push('/checkout/get-pro')}
          >
            Upgrade Now
            <i className="fal fa-rocket"></i>
          </button>
        </div>
        <div className="img-container">
          <img src={getProImg} alt="get pro"/>
        </div>
      </div>
      <div className="features-flex">
        {featuresRender}
      </div>
      <div className="features-section">
        <h3 className="title">Features of a Pro membership</h3>
        <ul>
          {featuresListRender}
        </ul>
      </div>
      <div className="reminder-section">
        <button 
          className="shadow-hover"
          onClick={() => history.push('/checkout/get-pro')}
        >
          Upgrade Now
          <i className="fal fa-rocket"></i>
        </button>
      </div>
    </div>
  )
}
