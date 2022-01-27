import React, { useEffect, useState } from 'react'
import './styles/Admin.css'
import { getAllCourses } from '../../services/courseServices'
import CourseRow from "./CourseRow"
import { getCourseCategories } from "../../services/adminServices"
import AppModal from '../ui/AppModal'
import { AppInput } from '../ui/AppInputs'
import { deleteSubDB, setSubDB, updateSubDB } from "../../services/CrudDB"
import { db } from "../../firebase/fire"

export default function AdminHome() {

  const [allCourses, setAllCourses] = useState([])
  const [courseCategories, setCourseCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [currentCategory, setCurrentCategory] = useState({})
  const [categoryName, setCategoryName] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')

  const allCoursesRender = allCourses?.map((course,i) => {
    return <CourseRow 
      course={course} 
      key={i} 
    />
  })

  const courseCategoriesRender = courseCategories?.map((category, i) => {
    return <div 
      className="category-row"
      onClick={() => {
        setCurrentCategory(category)
        setShowModal(true)
        setCategoryName(category.name)
      }}
      key={i}
    >
      <h6>
        <i className="far fa-graduation-cap"></i>
        {category.name}
      </h6>
      <i className="far fa-pen"></i>
    </div>
  })

  const saveCategory = () => {
    if(categoryName.length) {
      updateSubDB('admin', 'courseSettings', 'categories', currentCategory?.categoryID, {
        name: categoryName
      })
      .then(() => setShowModal(false))
      .catch(err => console.log(err))
    }
  }

  const newCategoryEnterPress = (e) => {
    let keyCode = e.code || e.key;
    if (keyCode === 'Enter') {
      addCategory()
    }
  }
  const addCategory = () => {
    if(newCategoryName.length) {
      const genCategoryID = db.collection('admin')
      .doc('courseSettings')
      .collection('categories')
      .doc().id
      setSubDB('admin', 'courseSettings', 'categories', genCategoryID, {
        categoryID: genCategoryID,
        name: newCategoryName,
        color: '',
        icon: ''
      })
      .then(() => {
        setNewCategoryName('')
      })
      .catch(err => console.log(err))
    }
  }

  const deleteCategory = () => {
    const confirm = window.confirm('Are you sure you want to remove this category?')
    if(confirm) {
      deleteSubDB('admin', 'courseSettings', 'categories', currentCategory?.categoryID)
      .then(() => setShowModal(false))
      .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    getAllCourses(setAllCourses, 20)
    getCourseCategories(setCourseCategories)
  },[])

  return (
    <div className="admin-section admin-courses">
      <section>
        <h4>Featured Courses</h4>
        <div className="table">
          <header>
            <h5 className="long">Course Title</h5>
            <h5>Price</h5>
            <h5>Instructor</h5>
            <h5>Students</h5>
            <h5>Rating</h5>
            <h5>Date Created</h5>
            <h5>Featured</h5>
          </header>
          <div className="body">
            {allCoursesRender}
          </div>
        </div>
      </section>
      <section>
        <h4>Course Categories</h4>
        <div className="course-categories">
          {courseCategoriesRender}
          <div className="category-input-generator">
            <input 
              placeholder="Enter a category name... (press enter)" 
              onChange={(e) => setNewCategoryName(e.target.value)} 
              onKeyPress={(e) => newCategoryEnterPress(e)}
              value={newCategoryName}
            />
            <div className="icon-container" onClick={() => addCategory()}>
              <i className="far fa-plus"></i>
            </div>
          </div> 
        </div>
      </section>
      <section>
        <h4>Promo Codes</h4>
      </section>

      <AppModal
        title="Edit Category"
        showModal={showModal}
        setShowModal={setShowModal}
        actions={
          <div className="btn-group">
            <button 
              onClick={() => saveCategory()}
            >Save</button>
            <button 
              onClick={() => deleteCategory()}
            >Delete</button>
          </div>
        }
      >
        <div className="category-content">
          <AppInput 
            title="Category Name"
            onChange={(e) => setCategoryName(e.target.value)}
            value={categoryName}
          />
        </div>
      </AppModal>
    </div>
  )
}

