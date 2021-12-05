import React from 'react'
import './styles/SearchBar.css'

export default function SearchBar(props) {

  const {width, height, onChange, showIcon} = props

  return (
    <div className="searchbar" style={{width, height}}>
      <input placeholder="Search..." onChange={() => onChange} />
      {showIcon &&
      <div className="icon-container">
        <i className="fal fa-search"></i>
      </div>
      }
    </div>
  )
}
