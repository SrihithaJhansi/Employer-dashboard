import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddEmployee() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: '',
    hire_date: '',
    username: '',
    password: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.position.trim()) newErrors.position = 'Position is required'
    if (!formData.department.trim()) newErrors.department = 'Department is required'
    if (!formData.salary) {
      newErrors.salary = 'Salary is required'
    } else if (isNaN(formData.salary) || parseFloat(formData.salary) <= 0) {
      newErrors.salary = 'Salary must be a positive number'
    }
    if (!formData.hire_date) newErrors.hire_date = 'Hire date is required'
    if (!formData.username.trim()) newErrors.username = 'Username is required'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const result = await response.json()
        setMessage(`Employee added successfully! ID: #${result.id}`)
        setMessageType('success')
        setFormData({
          name: '',
          email: '',
          position: '',
          department: '',
          salary: '',
          hire_date: '',
          username: '',
          password: ''
        })
        setTimeout(() => navigate('/employees'), 2000)
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Failed to add employee')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error adding employee:', error)
      setMessage('Error connecting to server')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }
  
  const departments = [
    'Engineering',
    'Marketing', 
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Design',
    'Customer Support'
  ]
  
  return (
    <div className="container">
      <div className="page-header">
        <h1>Add New Employee</h1>
        <p>Create a new employee record and user account</p>
      </div>
      
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="position">Position *</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Enter job position"
              />
              {errors.position && <span className="error-text">{errors.position}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <span className="error-text">{errors.department}</span>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salary">Annual Salary ($) *</label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Enter annual salary"
                min="0"
                step="0.01"
              />
              {errors.salary && <span className="error-text">{errors.salary}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="hire_date">Hire Date *</label>
              <input
                type="date"
                id="hire_date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
              />
              {errors.hire_date && <span className="error-text">{errors.hire_date}</span>}
            </div>
          </div>
          
          <div className="form-section">
            <h3>Login Credentials</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username for employee"
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password for employee"
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding Employee...' : 'Add Employee'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/employees')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEmployee