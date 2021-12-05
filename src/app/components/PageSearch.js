import React from 'react'
import './styles/PageSearch.css'
import SearchBar from './SearchBar'

export default function PageSearch(props) {

  const {title, description} = props

  return (
    <div className="page-search-bar">
      <h2>{title}</h2>
      <h6>{description}</h6>
      <section className="search-section">
        <SearchBar width="60%" height="60px"/>
        <button className="shadow-hover">Search<i className="fal fa-arrow-right"></i></button>
      </section>
    </div>
  )
}
