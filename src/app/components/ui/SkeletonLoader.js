import React from 'react'
import './styles/SkeletonLoader.css'

export default function SkeletonLoader(props) {

  const { width, height, amount } = props

  const renderSkeletons = Array(amount).fill(0).map((_,i) => {
    return <div 
      className="skeleton-loader"
      style={{width, height}}
      key={i}
    >
      <div className="rect-img" />
      <div>
        <div className="rect rect1" />
        <div className="rect rect2" />
      </div>
    </div>
  })

  return (
    renderSkeletons
  )
}
