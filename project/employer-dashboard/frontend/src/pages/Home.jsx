import React, { useState, useEffect } from 'react'

function Home() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalSalary: 0,
    departments: 0,
    avgSalary: 0
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchEmployeeStats()
  }, [])
  
  const fetchEmployeeStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/employees')
      if (response.ok) {
        const employees = await response.json()
        calculateStats(employees)
      }
    } catch (error) {
      console.error('Error fetching employee stats:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const calculateStats = (employees) => {
    const totalEmployees = employees.length
    const totalSalary = employees.reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0)
    const departments = new Set(employees.map(emp => emp.department)).size
    const avgSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0
    
    setStats({
      totalEmployees,
      totalSalary,
      departments,
      avgSalary
    })
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Welcome to your employer dashboard</p>
      </div>
      
      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.totalEmployees}</div>
            <div className="stat-label">Total Employees</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{formatCurrency(stats.totalSalary)}</div>
            <div className="stat-label">Total Payroll</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{stats.departments}</div>
            <div className="stat-label">Departments</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">{formatCurrency(stats.avgSalary)}</div>
            <div className="stat-label">Average Salary</div>
          </div>
        </div>
      )}
      
      <div className="card">
        <h2>Quick Actions</h2>
        <p>Manage your workforce efficiently with our comprehensive employee management system.</p>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/employees" className="btn btn-primary">
            Manage Employees
          </a>
          <a href="/about" className="btn btn-outline">
            Learn More
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home