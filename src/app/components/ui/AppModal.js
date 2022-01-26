import React from 'react'
import './styles/AppModal.css'

export default function AppModal(props) {

  const {title, children, actions, showModal, setShowModal} = props

  return (
    <div className={`app-modal-container ${showModal ? "show" : ""}`} onMouseDown={() => setShowModal(false)}>
      <div className="app-modal" onMouseDown={(e) => e.stopPropagation()}>
        <header>
          <h4>{title}</h4>
          <div className="icon-container" onClick={() => setShowModal(false)}>
            <i className="fal fa-times"></i>
          </div>
        </header>
        <section>
          {children}
        </section>
        <footer style={{display: actions ? 'flex' : "none"}}>
          {actions}
        </footer>
      </div>
    </div>
  )
}
