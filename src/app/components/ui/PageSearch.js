import React from 'react'
import '.././styles/PageSearch.css'
import SearchBar from './SearchBar'
import { useWindowDimensions } from "../../utils/customHooks"

export default function PageSearch(props) {

  const {title, description} = props
  const { screenWidth } = useWindowDimensions() 

  return (
    <div className="page-search-bar">
      <h2>{title}</h2>
      <h6>{description}</h6>
      <section className="search-section">
        <SearchBar width={screenWidth < 600 ? "100%" : "60%"} height="60px"/>
        <button className="shadow-hover">Search<i className="fal fa-arrow-right"></i></button>
      </section>
    </div>
  )
}
