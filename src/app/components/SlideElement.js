import React from 'react'

export default function SlideElement({slidePosition, children, index, className}) {

  return (
    <div className={`slide-element ${className ?? ""} ${slidePosition === index ? "active" : slidePosition > index ? "prev" : "next"}`}>
      {children}
    </div>
  )
}
