import React from 'react'
import HomeCont from './HomeCont'
import Sidebar from '../components/layout/Sidebar'
import './styles/AppContainer.css'
import { InstantSearch } from 'react-instantsearch-dom';
import { searchClient } from '../algolia/index'

export default function AppContainer() {
  return (
    <div className="app-container">
      <InstantSearch indexName="courses_index" searchClient={searchClient}>
        <Sidebar />
        <HomeCont />
      </InstantSearch>
    </div>
  )
}
