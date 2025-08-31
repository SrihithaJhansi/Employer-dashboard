import React from 'react'
import EmployeeList from '../components/EmployeeList'

function Employees({ user }) {
  return (
    <div className="container">
      <div className="page-header">
        <h1>Employee Management</h1>
        <p>View and manage employee records</p>
      </div>
      
      <div className="card">
        <EmployeeList user={user} />
      </div>
    </div>
  )
}

export default Employees