import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../store/store'
import './styles/AllCourses.css'
import { AppSelect } from '../components/AppInputs'
import { getCourseCategories, getCoursesCount } from '../services/adminServices' 
import { getAllCourses } from '../services/courseServices'
import CourseCard from '../components/CourseCard'

export default function AllCourses() {

  const {setNavTitle, setNavDescript} = useContext(StoreContext)
  const [allCourses, setAllCourses] = useState([])
  const [category, setCategory] = useState('')
  const [courseType, setCourseType] = useState('')
  const [coursePrice, setCoursePrice] = useState('')
  const [courseSkill, setCourseSkill] = useState('')
  const [categoriesArr, setCategoriesArr] = useState([])
  const [limit, setLimit] = useState(10)
  const [coursesCount, setCoursesCount] = useState('')

  const courseTypes = ['All Courses', 'Video Courses', 'Text-based Courses', 'Tutorial Courses']
  const coursePrices = [
    {name: 'All Prices', value: 'all'},
    {name: 'Free', value: [0,0]},
    {name: '$1 - $20', value: [1,20]},
    {name: '$20 - $50', value: [20,50]},
    {name: '$50 - $100', value: [50,100]},
    {name: '$100 +', value: [100,Infinity]}
  ]
  const courseSkills = ['All Skills', 'Easy', 'Intermediate', 'Advanced']
  const coursesSortArr = ['Default (Date Added)', 'Alphabetically (Asc)', 'Alphabetically (Desc)', 'Category', 'Course Type', 'Price (Asc)', 'Price (Desc)', 'Skill']

  const categoriesRender = categoriesArr?.map((cat,i) => {
    return {name: cat.name}
  })
  const courseTypesRender = courseTypes.map((type,i) => {
    return {name: type}
  })
  const coursePricesRender = coursePrices.map((type,i) => {
    return {name: type.name, value: type.value}
  })
  const courseSkillsRender = courseSkills.map((type,i) => {
    return {name: type}
  })
  const courseSortRender = coursesSortArr.map((type,i) => {
    return {name: type}
  })

  const allCoursesRender = allCourses?.map((course,i) => {
    return <CourseCard course={course} key={i} />
  })

  useEffect(() => {
    setNavTitle('All Courses')
    setNavDescript(coursesCount + " total courses available")
  },[])

  useEffect(() => {
    getCourseCategories(setCategoriesArr)
    getAllCourses(setAllCourses, limit)
    getCoursesCount(setCoursesCount)
  },[])

  return (
    <div className="all-courses-page">
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
        </div>
      </div>
      <div className="sort-row">
        <h5>Showing {Math.min(limit, coursesCount)} of {coursesCount} results</h5>
        <div>
          <h5>Sort By:</h5>
          <AppSelect 
            options={courseSortRender}
          />
        </div>
      </div>
      <div className="courses-content">
        {allCoursesRender}
      </div>
    </div>
  )
}
