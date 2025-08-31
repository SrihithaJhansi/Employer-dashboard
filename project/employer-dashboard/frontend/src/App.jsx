import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Home from './pages/Home'
import Employees from './pages/Employees'
import AddEmployee from './pages/AddEmployee'
import Profile from './pages/Profile'
import About from './pages/About'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])
  
  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }
  
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }
  
  if (loading) {
    return <div className="loading">Loading...</div>
  }
  
  if (!user) {
    return <Login onLogin={handleLogin} />
  }
  
  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/employees" element={<Employees user={user} />} />
            {user.role === 'admin' && (
              <Route path="/add-employee" element={<AddEmployee />} />
            )}
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/profile/:id" element={<Profile user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App