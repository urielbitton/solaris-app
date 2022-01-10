import React, { useContext, useEffect } from 'react'
import './styles/GetProPage.css'
import { StoreContext } from '../store/store'
import getProImg from '../assets/imgs/get-pro-bg.png'
import { proFeatures } from "../api/apis"

export default function GetProPage() {

  const { setNavTitle, setNavDescript } = useContext(StoreContext)

  const featuresRender = proFeatures?.map((feature, i) => {
    return <div className="feature-column">
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
          <button className="shadow-hover">
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
      <div className="faq-section">

      </div>
      <div className="reminder-section">

      </div>
      {/* hide by default and show when click on "upgrade now" */}
      <div className="upgrade-section">

      </div>
    </div>
  )
}
