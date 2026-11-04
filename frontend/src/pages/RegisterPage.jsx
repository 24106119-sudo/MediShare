import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage({ setActivePage }) {
  const { register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('ROLE_DONOR')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = await register({
        fullName,
        email,
        password,
        role,
        phone,
        address,
        organizationName: role === 'ROLE_NGO' ? organizationName : null
      })

      if (user.role === 'ROLE_DONOR') {
        setActivePage('donor')
      } else {
        setActivePage('beneficiary')
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px', maxWidth: '560px' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📝</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Create MediShare Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Register to donate medicines or submit healthcare supply requests
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
            <label className="form-label">I want to join as</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="ROLE_DONOR">Medicine Donor (Individual / Clinic / Pharmacy)</option>
              <option value="ROLE_BENEFICIARY">Individual Beneficiary (Patient / Caregiver)</option>
              <option value="ROLE_NGO">Healthcare NGO / Charitable Trust</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name or Primary Contact</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Dr. Jane Smith or Robert Martinez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {role === 'ROLE_NGO' && (
            <div className="form-group">
              <label className="form-label">Registered NGO / Organization Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Care & Hope Health Foundation"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>
          )}

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password (min 6 chars)</label>
              <input
                type="password"
                required
                minLength={6}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="+1 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Address / Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="City, State"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '12px' }}
          >
            {loading ? 'Saving Record to MySQL...' : 'Create Account & Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <button
            onClick={() => setActivePage('login')}
            style={{ color: 'var(--primary)', fontWeight: '600' }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}
