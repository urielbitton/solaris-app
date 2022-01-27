import React, { useEffect, useState } from 'react'
import { getAllIncidents } from '../../services/adminServices'
import IncidentRow from "./IncidentRow"
import AppModal from '../ui/AppModal'
import { AppSwitch } from '../ui/AppInputs'
import { updateDB } from '../../services/CrudDB'

export default function AdminIncidents() {

  const [allIncidents, setAllIncidents] = useState([])
  const [currentIncident, setCurrentIncident] = useState({})
  const [showModal, setShowModal] = useState(false)

  const allIncidentsRender = allIncidents?.map((incident,i) => {
    return <IncidentRow 
      incident={incident} 
      setCurrentIncident={setCurrentIncident}
      setShowModal={setShowModal}
      key={i} 
    />
  })

  const toggleResolved = (e) => {
    updateDB('incidents', currentIncident?.incidentID, {
      isResolved: e.target.checked
    })
  }

  useEffect(() => {
    getAllIncidents(setAllIncidents, 20)
  },[])

  return (
    <div className="admin-section admin-incidents">
      <section>
        <h4>General</h4>
        <div className="table">
          <header>
            <h5>Incident #</h5>
            <h5 className="long">Report</h5>
            <h5>Incident Type</h5>
            <h5>Reason</h5>
            <h5>Reporter</h5>
            <h5>Status</h5>
            <h5>Date Reported</h5>
          </header>
          <div className="body">
            {allIncidentsRender}
          </div>
        </div>
      </section>

      <AppModal
        title={`${currentIncident?.incidentNumber} - ${currentIncident?.isResolved ? 'Resolved' : 'Unresolved'}`}
        showModal={showModal}
        setShowModal={setShowModal}
        actions={
          <button onClick={() => setShowModal(false)}>Done</button>
        }
      >
        <div className="incident-content">
          <p>{currentIncident?.text}</p>
          <AppSwitch
            title="Resolve Incident"
            onChange={(e) => toggleResolved(e)}
            value={currentIncident?.isResolved}
          />
        </div>
      </AppModal>
    </div>
  )
}
