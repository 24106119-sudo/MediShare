import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ activePage, setActivePage }) {
  const { user, logout, isAuthenticated } = useAuth()

  const handleNav = (page) => {
    setActivePage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="header">
      <div className="container header-content">
        <div className="brand" onClick={() => handleNav('home')} style={{ cursor: 'pointer' }}>
          <div className="brand-icon">💊</div>
          <span>MediShare</span>
        </div>

        <nav className="nav-links">
          <button
            onClick={() => handleNav('home')}
            className={activePage === 'home' ? 'active' : ''}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('available')}
            className={activePage === 'available' ? 'active' : ''}
          >
            Available Medicines
          </button>

          {isAuthenticated && (user?.role === 'ROLE_DONOR' || user?.role === 'ROLE_ADMIN') && (
            <button
              onClick={() => handleNav('donor')}
              className={activePage === 'donor' ? 'active' : ''}
            >
              Donor Dashboard
            </button>
          )}

          {isAuthenticated && (user?.role === 'ROLE_BENEFICIARY' || user?.role === 'ROLE_NGO' || user?.role === 'ROLE_ADMIN') && (
            <button
              onClick={() => handleNav('beneficiary')}
              className={activePage === 'beneficiary' ? 'active' : ''}
            >
              Beneficiary Dashboard
            </button>
          )}

          {isAuthenticated && user?.role === 'ROLE_ADMIN' && (
            <button
              onClick={() => handleNav('admin')}
              className={activePage === 'admin' ? 'active' : ''}
            >
              Admin Control Panel
            </button>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="user-badge">
                <span>{user.fullName}</span>
                <span className={`role-pill role-${user.role?.replace('ROLE_', '').toLowerCase()}`}>
                  {user.role?.replace('ROLE_', '')}
                </span>
              </div>
              <button
                onClick={() => {
                  logout()
                  handleNav('login')
                }}
                className="btn btn-secondary btn-sm"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => handleNav('login')}
                className={`btn btn-secondary btn-sm ${activePage === 'login' ? 'active' : ''}`}
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav('register')}
                className="btn btn-primary btn-sm"
              >
                Register
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
