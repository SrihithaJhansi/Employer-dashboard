import React from 'react'

function About() {
  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">About Employer Dashboard</h1>
        <p className="page-subtitle">Your comprehensive employee management solution</p>
      </div>
      
      <div className="card">
        <h2>Features</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li><strong>Employee Management:</strong> Add, view, and delete employee records</li>
          <li><strong>Department Organization:</strong> Organize employees by departments</li>
          <li><strong>Salary Tracking:</strong> Monitor individual and total payroll expenses</li>
          <li><strong>Dashboard Overview:</strong> Get quick insights into your workforce</li>
          <li><strong>Responsive Design:</strong> Access from any device</li>
        </ul>
      </div>
      
      <div className="card">
        <h2>Technology Stack</h2>
        <div className="form-row">
          <div>
            <h3>Frontend</h3>
            <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
              <li>React 18</li>
              <li>React Router</li>
              <li>Modern CSS</li>
              <li>Responsive Design</li>
            </ul>
          </div>
          <div>
            <h3>Backend</h3>
            <ul style={{ marginLeft: '2rem', lineHeight: '2' }}>
              <li>Python</li>
              <li>Tornado Framework</li>
              <li>MySQL Database</li>
              <li>RESTful APIs</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2>Getting Started</h2>
        <ol style={{ marginLeft: '2rem', lineHeight: '2' }}>
          <li>Set up your MySQL database connection</li>
          <li>Start the backend server (Python Tornado)</li>
          <li>Launch the frontend application (React)</li>
          <li>Begin adding employees through the Employees page</li>
          <li>Monitor your workforce through the Dashboard</li>
        </ol>
      </div>
      
      <div className="card">
        <h2>API Endpoints</h2>
        <table className="employees-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Endpoint</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GET</td>
              <td>/api/employees</td>
              <td>Get all employees</td>
            </tr>
            <tr>
              <td>POST</td>
              <td>/api/employees</td>
              <td>Create new employee</td>
            </tr>
            <tr>
              <td>GET</td>
              <td>/api/employees/{'{id}'}</td>
              <td>Get employee by ID</td>
            </tr>
            <tr>
              <td>DELETE</td>
              <td>/api/employees/{'{id}'}</td>
              <td>Delete employee by ID</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default About