import React, { useContext } from 'react'
import HomeCont from './HomeCont'
import Sidebar from '../components/layout/Sidebar'
import './styles/AppContainer.css'
import './styles/DarkMode.css'
import { InstantSearch } from 'react-instantsearch-dom';
import { searchClient } from '../algolia/index'
import { StoreContext } from "../store/store";

export default function AppContainer() {

  const { darkMode } = useContext(StoreContext)

  return (
    <div className={`app-container ${ darkMode ? "dark-app" : "" }`}>
      <InstantSearch indexName="courses_index" searchClient={searchClient}>
        <Sidebar />
        <HomeCont />
      </InstantSearch>
    </div>
  )
}
