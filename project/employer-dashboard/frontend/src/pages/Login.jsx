import React, { useState } from 'react'

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password) {
      setError('Please enter both username and password')
      return
    }
    
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        onLogin(data.user)
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Employer Dashboard</h1>
          <p>Sign in to your account</p>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-info">
          <h3>Demo Accounts</h3>
          <div className="demo-accounts">
            <div>
              <strong>Admin:</strong> username: admin, password: admin123
            </div>
            <div>
              <strong>Employee:</strong> Create employee account after admin login
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login