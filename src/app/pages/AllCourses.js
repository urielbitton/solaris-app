import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../store/store'
import './styles/AllCourses.css'
import { AppSelect } from '../components/ui/AppInputs'
import { getCourseCategories, getCoursesCount } from '../services/adminServices' 
import { getAllCourses } from '../services/courseServices'
import PageSearch from '../components/ui/PageSearch'
import { Hits, Pagination } from "react-instantsearch-dom"
import SearchCourseCard from "../components/course/SearchCourseCard"

export default function AllCourses() {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)
  const [allCourses, setAllCourses] = useState([])
  const [category, setCategory] = useState('all')
  const [courseType, setCourseType] = useState('all')
  const [coursePrice, setCoursePrice] = useState('all')
  const [courseSkill, setCourseSkill] = useState('all')
  const [categoriesArr, setCategoriesArr] = useState([])
  const [limit, setLimit] = useState(10)
  const [coursesCount, setCoursesCount] = useState(0)

  const courseTypes = [
    {name: 'All Courses', value: 'all'},
    {name: 'Video Courses', value: 'video'},
    {name: 'Text-based Courses', value: 'text'},
    {name: 'Tutorial Courses', value: 'tutorials'}
  ]
  const coursePrices = [
    {name: 'All Prices', value: 'all'},
    {name: 'Free', value: 0},
    {name: '$20 and more', value: 20},
    {name: '$50 and more', value: 50},
    {name: '$100 and more', value: 100},
    {name: '$150 and more', value: Infinity}
  ]
  const courseSkills = [
    {name: 'All Skills', value: 'all'},
    {name: 'Easy', value: 'easy'},
    {name: 'Intermediate', value: 'intermediate'},
    {name: 'Advanced', value: 'advanced'}
  ]
  const coursesSortArr = [
    {name: 'Date Created (Desc)', value: 'dateCreatedDesc'},
    {name: 'Date Created (Asc)', value: 'dateCreatedAsc'},
    {name: 'Alphabetically (Desc)', value: 'azDesc'},
    {name:'Alphabetically (Asc)', value: 'azAsc'}, 
    {name: 'Category', value: 'category'},
    {name: 'Course Type', value: 'courseType'}, 
    {name: 'Price (Desc)', value: 'priceDesc'}, 
    {name: 'Price (Asc)', value: 'priceAsc'}, 
    {name: 'Skill', value: 'skill'}
  ]

  const categoriesRender = categoriesArr?.map((cat) => {
    return {name: cat.name}
  })
  const courseTypesRender = courseTypes.map((type) => {
    return {name: type.name, value: type.value}
  })
  const coursePricesRender = coursePrices.map((type) => {
    return {name: type.name, value: type.value}
  })
  const courseSkillsRender = courseSkills.map((type) => {
    return {name: type.name, value: type.value}
  })
  const courseSortRender = coursesSortArr.map((type) => {
    return {name: type.name, value: type.value}
  })

  const resetFilters = () => {
    setCategory('all')
    setCourseType('all')
    setCoursePrice('all')
    setCourseSkill('all')
  }

  useEffect(() => {
    setNavTitle('All Courses')
    setNavDescript(coursesCount + " courses in total")
  },[coursesCount]) 

  useEffect(() => {
    getCourseCategories(setCategoriesArr)
    getCoursesCount(setCoursesCount)
  },[])
  
  useEffect(() => {
    getAllCourses(setAllCourses, 10)
  },[])

  return (
    <div className="all-courses-page">
      <header>
        <div className="filters-toolbar">
          <h5><i className="far fa-sliders-h"></i>Filters</h5>
          <div className="filter-selects">
            <AppSelect 
              options={[{name:'All Categories', value:'all'}, ...categoriesRender]}
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              namebased
            />
            <AppSelect 
              options={courseTypesRender}
              onChange={(e) => setCourseType(e.target.value)}
              value={courseType}
              namebased
            />
            <AppSelect 
              options={coursePricesRender}
              onChange={(e) => setCoursePrice(e.target.value)}
              value={coursePrice}
              namebased
            />
            <AppSelect 
              options={courseSkillsRender}
              onChange={(e) => setCourseSkill(e.target.value)}
              value={courseSkill}
              namebased
            />
            <button className="reset-btn" onClick={resetFilters}>
              <i className="fal fa-redo"></i>
              Reset
            </button>
          </div>
        </div>
        <PageSearch 
          title="Find A Course"
          description="Search by course name, ID, instructor or category"
        />
      </header>
      <div className="sort-row">
        <h5>Showing {Math.min(limit, allCourses.length)} of {coursesCount} results</h5>
        <div>
          <h5>Sort By:</h5>
          <AppSelect 
            options={courseSortRender}
            namebased
          />
        </div>
      </div>
      <div className="courses-content">
        <Hits hitComponent={SearchCourseCard} />
      </div>
      <Pagination />
    </div>
  )
}
