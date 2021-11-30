import React from 'react'
import {AppInput} from './AppInputs'
import './styles/SearchBar.css'

export default function SearchBar(props) {

  const {width, onChange} = props

  return (
    <div className="searchbar" style={{width}}>
      <AppInput placeholder="Search..." onChange={() => onChange}/>
      <div className="icon-container">
        <i className="fal fa-search"></i>
      </div>
    </div>
  )
}
