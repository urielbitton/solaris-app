import React from 'react'
import './styles/AppModal.css'

export default function AppModal(props) {

  const {title, children, actions, showModal, setShowModal} = props

  return (
    <div className={`app-modal-container ${showModal ? "show" : ""}`} onClick={(e) => setShowModal(false)}>
      <div className="app-modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h4>{title}</h4>
          <div className="icon-container" onClick={() => setShowModal(false)}>
            <i className="fal fa-times"></i>
          </div>
        </header>
        <section>
          {children}
        </section>
        <footer>
          {actions}
        </footer>
      </div>
    </div>
  )
}
