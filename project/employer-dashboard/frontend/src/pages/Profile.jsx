import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function Profile({ user }) {
  const { id } = useParams()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  
  const profileId = id || (user ? user.employee_id : null)
  const isOwnProfile = !id || (user && parseInt(id) === user.employee_id)
  
  useEffect(() => {
    console.log('👤 User object:', user)
    console.log('🆔 Profile ID calculated:', profileId)
    
    if (user && user.role === 'admin') {
      // For admin users, skip employee fetching
      console.log('⚡ Admin user detected, skipping employee fetch')
      setLoading(false)
    } else if (profileId) {
      console.log('🚀 Starting to fetch employee...')
      fetchEmployee()
    } else {
      console.log('⏹️ No profile ID available, stopping loading')
      setLoading(false)
    }
  }, [profileId, user])
  
  const fetchEmployee = async () => {
    try {
      setLoading(true)
      console.log(`🔄 Fetching employee ID: ${profileId}`)
      const response = await fetch(`http://localhost:8000/api/profile/${profileId}`)
      
      console.log(`📊 Response status: ${response.status}`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Employee data received:', data)
        setEmployee(data)
        setFormData({
          name: data.name,
          email: data.email
        })
      } else if (response.status === 404) {
        console.log('❌ Employee not found (404)')
        showMessage('Employee not found', 'error')
        setEmployee(null)
      } else {
        console.log('❌ Failed to fetch employee profile')
        showMessage('Failed to fetch employee profile', 'error')
      }
    } catch (error) {
      console.error('❌ Error fetching employee:', error)
      showMessage('Error connecting to server', 'error')
    } finally {
      console.log('🏁 Fetch completed, setting loading to false')
      setLoading(false)
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`http://localhost:8000/api/profile/${profileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        showMessage('Profile updated successfully!', 'success')
        setEditing(false)
        fetchEmployee()
      } else {
        const errorData = await response.json()
        showMessage(errorData.error || 'Failed to update profile', 'error')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      showMessage('Error connecting to server', 'error')
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
      month: 'long',
      day: 'numeric'
    })
  }

  // If user is admin, show admin information instead of employee profile
  if (user && user.role === 'admin') {
    return (
      <div className="container">
        <div className="page-header">
          <h1>Administrator Account</h1>
          <p>System Administrator Dashboard</p>
        </div>
        
        <div className="card">
          <div className="profile-view">
            <div className="profile-header">
              <h2>{user.username} (Administrator)</h2>
            </div>
            
            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Username:</span>
                <span className="detail-value">{user.username}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Role:</span>
                <span className="detail-value">
                  <span className="admin-badge">Administrator</span>
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">User ID:</span>
                <span className="detail-value">#{user.id}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Account Created:</span>
                <span className="detail-value">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">
                  {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
      </div>
    )
  }
  
  if (!employee) {
    return (
      <div className="container">
        <div className="error-message">Employee not found</div>
      </div>
    )
  }
  
  return (
    <div className="container">
      <div className="page-header">
        <h1>{isOwnProfile ? 'My Profile' : `${employee.name}'s Profile`}</h1>
        <p>Employee ID: #{employee.id}</p>
      </div>
      
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      
      <div className="card">
        {editing && isOwnProfile ? (
          <form onSubmit={handleSubmit}>
            <h2>Edit Profile</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-view">
            <div className="profile-header">
              <h2>{employee.name}</h2>
              {isOwnProfile && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Employee ID:</span>
                <span className="detail-value">#{employee.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{employee.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Position:</span>
                <span className="detail-value">{employee.position}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Department:</span>
                <span className="detail-value">{employee.department}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Salary:</span>
                <span className="detail-value">{formatCurrency(employee.salary)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Hire Date:</span>
                <span className="detail-value">{formatDate(employee.hire_date)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile