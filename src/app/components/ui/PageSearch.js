import React from 'react'
import '.././styles/PageSearch.css'
import { useWindowDimensions } from "../../utils/customHooks"
import { SearchBox } from 'react-instantsearch-dom';

export default function PageSearch(props) {

  const {title, description} = props
  const { screenWidth } = useWindowDimensions() 

  return (
    <div className="page-search-bar">
      <h2>{title}</h2>
      <h6>{description}</h6>
      <section className="search-section">
        <SearchBox 
          className={`algolia-search-box ${screenWidth < 600 ? "full" : 'adapt'}`}
        />
      </section>
    </div>
  )
}
