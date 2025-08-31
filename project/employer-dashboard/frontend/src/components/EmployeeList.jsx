import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function EmployeeList({ user }) {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  
  useEffect(() => {
    fetchEmployees()
  }, [])
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEmployees(employees)
    } else {
      const filtered = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toString().includes(searchTerm)
      )
      setFilteredEmployees(filtered)
    }
  }, [employees, searchTerm])
  
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/employees')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      } else {
        showMessage('Failed to fetch employees', 'error')
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      showMessage('Error connecting to server', 'error')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const response = await fetch(`http://localhost:8000/api/employees/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          showMessage('Employee deleted successfully!', 'success')
          fetchEmployees()
        } else {
          const errorData = await response.json()
          showMessage(errorData.error || 'Failed to delete employee', 'error')
        }
      } catch (error) {
        console.error('Error deleting employee:', error)
        showMessage('Error connecting to server', 'error')
      }
    }
  }
  
  const showMessage = (text, type) => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 5000)
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  return (
    <div>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      
      <div className="search-section">
        <input
          type="text"
          placeholder="Search employees by ID, name, email, position, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        {searchTerm && (
          <div className="search-info">
            Showing {filteredEmployees.length} of {employees.length} employees
            <button 
              onClick={() => setSearchTerm('')}
              className="clear-search"
            >
              Clear
            </button>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="loading">Loading employees...</div>
      ) : filteredEmployees.length === 0 ? (
        <div className="no-results">
          {searchTerm ? (
            <div>
              <h3>No employees found</h3>
              <p>No employees match your search: "{searchTerm}"</p>
            </div>
          ) : (
            <div>
              <h3>No employees found</h3>
              <p>No employees have been added yet.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Position</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Hire Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee.id}>
                  <td className="employee-id">#{employee.id}</td>
                  <td className="employee-link">
                   
                      {employee.name}
                    
                  </td>
                  <td>{employee.email}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>{formatCurrency(employee.salary)}</td>
                  <td>{formatDate(employee.hire_date)}</td>
                  <td>
                    {user.role === 'admin' ? (
                      <button 
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(employee.id, employee.name)}
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="read-only">Read Only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default EmployeeList