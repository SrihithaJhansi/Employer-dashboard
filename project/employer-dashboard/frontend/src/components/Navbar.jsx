import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar({ user, onLogout }) {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Employer Dashboard
        </Link>
        
        <div className="nav-center">
          <ul className="nav-links">
            <li>
              <Link to="/" className={isActive('/')}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/employees" className={isActive('/employees')}>
                Employees
              </Link>
            </li>
            {user.role === 'admin' && (
              <li>
                <Link to="/add-employee" className={isActive('/add-employee')}>
                  Add Employee
                </Link>
              </li>
            )}
            <li>
              <Link to="/profile" className={isActive('/profile')}>
                Profile
              </Link>
            </li>
            <li>
              <Link to="/about" className={isActive('/about')}>
                About
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="nav-user">
          <span className="user-info">
            {user.username} ({user.role})
          </span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar