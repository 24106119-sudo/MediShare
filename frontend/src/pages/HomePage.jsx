import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

export default function HomePage({ setActivePage }) {
  const { user, isAuthenticated } = useAuth()
  const [healthStatus, setHealthStatus] = useState(null)
  const [availableCount, setAvailableCount] = useState(0)

  useEffect(() => {
    api.getHealth()
      .then(res => setHealthStatus(res))
      .catch(() => setHealthStatus({ status: 'OFFLINE', database: 'DISCONNECTED' }))

    api.getAvailableDonations()
      .then(list => setAvailableCount(list?.length || 0))
      .catch(() => setAvailableCount(0))
  }, [])

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #0d9488 100%)',
        borderRadius: '24px',
        padding: '60px 40px',
        color: '#ffffff',
        marginBottom: '40px',
        boxShadow: '0 20px 25px -5px rgba(5, 150, 105, 0.25)'
      }}>
        <div style={{ maxWidth: '750px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            <span>✨ Live MySQL Database Connected</span>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: healthStatus?.database === 'UP' ? '#4ade80' : '#f87171'
            }}></span>
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1.15, marginBottom: '20px' }}>
            Bridging the Healthcare Divide Through Medicine Redistribution
          </h1>

          <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '32px', lineHeight: 1.6 }}>
            Every year, billions worth of usable unexpired medications go to waste while millions lack access to life-saving treatment. MediShare verifies, safely stores, and transfers surplus medicines directly to verified beneficiaries and NGOs.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              user?.role === 'ROLE_DONOR' ? (
                <button
                  onClick={() => setActivePage('donor')}
                  className="btn"
                  style={{ background: '#ffffff', color: '#065f46', fontSize: '1.05rem', padding: '12px 28px' }}
                >
                  Go to Donor Dashboard →
                </button>
              ) : user?.role === 'ROLE_ADMIN' ? (
                <button
                  onClick={() => setActivePage('admin')}
                  className="btn"
                  style={{ background: '#ffffff', color: '#065f46', fontSize: '1.05rem', padding: '12px 28px' }}
                >
                  Open Admin Control Panel →
                </button>
              ) : (
                <button
                  onClick={() => setActivePage('beneficiary')}
                  className="btn"
                  style={{ background: '#ffffff', color: '#065f46', fontSize: '1.05rem', padding: '12px 28px' }}
                >
                  Go to Beneficiary Dashboard →
                </button>
              )
            ) : (
              <>
                <button
                  onClick={() => setActivePage('register')}
                  className="btn"
                  style={{ background: '#ffffff', color: '#065f46', fontSize: '1.05rem', padding: '12px 28px' }}
                >
                  Donate Medicines
                </button>
                <button
                  onClick={() => setActivePage('login')}
                  className="btn"
                  style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.4)', fontSize: '1.05rem', padding: '12px 28px' }}
                >
                  Sign In / Quick Test
                </button>
              </>
            )}

            <button
              onClick={() => setActivePage('available')}
              className="btn btn-secondary"
              style={{ background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '12px 24px' }}
            >
              Browse Catalog ({availableCount} Available)
            </button>
          </div>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="card" style={{ marginBottom: '40px', background: '#f8fafc', borderLeft: '4px solid #059669' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '4px' }}>Real-time Database Health Check</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Backend: <code>Spring Boot 3.3.5 (Kotlin 1.9.25)</code> | Database: <code>MySQL 8.0 Engine</code>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hikari Pool: </span>
              <strong style={{ color: '#059669' }}>ACTIVE (10 max / 5 idle)</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status: </span>
              <span className={`status-badge ${healthStatus?.database === 'UP' ? 'status-approved' : 'status-rejected'}`}>
                {healthStatus?.database || 'CONNECTING...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Step Workflow */}
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '24px', textAlign: 'center' }}>
        How MediShare Works
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '60px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📦</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>1. Donors Submit Inventory</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Individuals, pharmacies, and clinics upload unexpired medicines with batch details, expiry date, quantity, and storage conditions.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>2. Admin & NGO Inspection</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Pharmacists and administrators review batch records, verify packaging integrity, and quarantine any expired medication automatically.
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🤝</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>3. Verified Redistribution</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Patients and partner healthcare charities request medicines against verified prescriptions and receive direct delivery.
          </p>
        </div>
      </div>
    </div>
  )
}
