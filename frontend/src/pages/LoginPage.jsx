import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage({ setActivePage }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await login(email, password)
      if (user.role === 'ROLE_ADMIN') {
        setActivePage('admin')
      } else if (user.role === 'ROLE_DONOR') {
        setActivePage('donor')
      } else {
        setActivePage('beneficiary')
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (presetEmail, presetPassword) => {
    setEmail(presetEmail)
    setPassword(presetPassword)
  }

  return (
    <div className="container" style={{ paddingTop: '50px', paddingBottom: '60px', maxWidth: '480px' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔐</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to access your MediShare dashboard
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '8px' }}
          >
            {loading ? 'Authenticating with MySQL...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <button
            onClick={() => setActivePage('register')}
            style={{ color: 'var(--primary)', fontWeight: '600' }}
          >
            Create one
          </button>
        </div>

        {/* Quick Demo Logins */}
        <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '12px', textAlign: 'center' }}>
            Quick Demo Logins (Pre-seeded in MySQL)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={() => quickLogin('admin@medishare.org', 'admin123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
            >
              👑 Admin
            </button>
            <button
              onClick={() => quickLogin('donor@medishare.org', 'donor123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
            >
              🎁 Donor
            </button>
            <button
              onClick={() => quickLogin('beneficiary@medishare.org', 'user123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
            >
              🏥 Beneficiary
            </button>
            <button
              onClick={() => quickLogin('ngo@carehope.org', 'ngo123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', justifyContent: 'flex-start' }}
            >
              🏢 Verified NGO
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
