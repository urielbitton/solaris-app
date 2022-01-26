import React, { useEffect, useState } from 'react'
import { getAllIncidents } from '../../services/adminServices'
import IncidentRow from "./IncidentRow"

export default function AdminIncidents() {

  const [allIncidents, setAllIncidents] = useState([])

  const allIncidentsRender = allIncidents?.map((incident,i) => {
    return <IncidentRow 
      incident={incident} 
      key={i} 
    />
  })

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
    </div>
  )
}
