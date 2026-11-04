import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function AvailableMedicinesPage({ setActivePage }) {
  const { isAuthenticated, user } = useAuth()
  const [medicines, setMedicines] = useState([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAvailableDonations()
      .then(res => setMedicines(res || []))
      .catch(err => console.error('Failed to fetch available medications:', err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = medicines.filter(m => {
    const matchesSearch = m.medicineName.toLowerCase().includes(search.toLowerCase()) ||
      (m.genericName && m.genericName.toLowerCase().includes(search.toLowerCase())) ||
      (m.manufacturer && m.manufacturer.toLowerCase().includes(search.toLowerCase()))

    const matchesCategory = categoryFilter === 'ALL' || m.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Available Verified Medicines</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Browse unexpired, quality-inspected medications currently in stock for patient reallocation
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search by medicine name, generic molecule, or manufacturer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={{ width: '200px' }}>
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="Analgesic">Analgesic</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Antidiabetic">Antidiabetic</option>
              <option value="Antacid">Antacid</option>
              <option value="Antihistamine">Antihistamine</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
          Loading available medications from MySQL...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💊</div>
          <p>No verified medications found matching your search filter.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filtered.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="role-pill role-donor" style={{ fontSize: '0.7rem' }}>
                    {item.category || 'General'}
                  </span>
                  <span className="status-badge status-approved" style={{ fontSize: '0.7rem' }}>
                    Verified
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '4px' }}>
                  {item.medicineName}
                </h3>
                {item.genericName && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Generic: {item.genericName}
                  </div>
                )}

                <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>In Stock:</span>
                    <strong>{item.quantity} {item.unit}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Expiry:</span>
                    <strong style={{ color: '#059669' }}>{item.expiryDate}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Batch:</span>
                    <code>{item.batchNumber || 'N/A'}</code>
                  </div>
                </div>

                {item.storageCondition && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    ❄️ {item.storageCondition}
                  </div>
                )}
              </div>

              <div>
                {isAuthenticated ? (
                  user?.role === 'ROLE_BENEFICIARY' || user?.role === 'ROLE_NGO' ? (
                    <button
                      onClick={() => setActivePage('beneficiary')}
                      className="btn btn-primary"
                      style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
                    >
                      Request via Beneficiary Portal →
                    </button>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                      Logged in as {user?.role?.replace('ROLE_', '')}
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => setActivePage('login')}
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
                  >
                    Sign In to Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
