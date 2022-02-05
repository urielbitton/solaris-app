import React, { useContext, useEffect } from 'react'
import HomeCont from './HomeCont'
import Sidebar from '../components/layout/Sidebar'
import './styles/AppContainer.css'
import './styles/DarkMode.css'
import { InstantSearch } from 'react-instantsearch-dom';
import { searchClient } from '../algolia/index'
import { StoreContext } from "../store/store"
import { useWindowDimensions } from '../utils/customHooks'

export default function AppContainer() {

  const { darkMode, setWindowPadding } = useContext(StoreContext)
  const { screenWidth } = useWindowDimensions()

  useEffect(() => {
    if(screenWidth < 600) {
      setWindowPadding('100px 15px 0 15px')
    }
    else {
      setWindowPadding('100px 22px 0 22px')
    }
  },[screenWidth])

  return (
    <div className={`app-container ${ darkMode ? "dark-app" : "" }`}>
      <InstantSearch indexName="courses_index" searchClient={searchClient}>
        <Sidebar />
        <HomeCont />
      </InstantSearch>
    </div>
  )
}
