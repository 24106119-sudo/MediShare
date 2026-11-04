import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import StatCard from '../components/StatCard'

export default function BeneficiaryDashboardPage({ setActivePage }) {
  const [stats, setStats] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Modal form state
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    medicineName: '',
    quantityRequested: 10,
    urgencyLevel: 'MEDIUM',
    reason: '',
    prescriptionProofUrl: ''
  })

  const loadData = async () => {
    setError('')
    try {
      const [dashData, myRequests] = await Promise.all([
        api.getBeneficiaryDashboard(),
        api.getMyRequests()
      ])
      setStats(dashData)
      setRequests(myRequests)
    } catch (err) {
      setError(err.message || 'Failed to fetch beneficiary data from database')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  const handleCreateRequest = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await api.createRequest(formData)
      setSuccess(`Request for "${formData.medicineName}" registered in MySQL successfully!`)
      setShowModal(false)
      setFormData({
        medicineName: '',
        quantityRequested: 10,
        urgencyLevel: 'MEDIUM',
        reason: '',
        prescriptionProofUrl: ''
      })
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to submit medicine request')
    } finally {
      setSubmitting(false)
    }
  }

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'CRITICAL': return <span className="status-badge" style={{ background: '#fee2e2', color: '#991b1b' }}>🚨 Critical</span>
      case 'HIGH': return <span className="status-badge" style={{ background: '#ffedd5', color: '#c2410c' }}>⚡ High</span>
      case 'MEDIUM': return <span className="status-badge" style={{ background: '#fef3c7', color: '#b45309' }}>Standard</span>
      case 'LOW': return <span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>Low</span>
      default: return <span>{urgency}</span>
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return <span className="status-badge status-approved">✓ Approved</span>
      case 'PENDING': return <span className="status-badge status-pending">⏳ Under Review</span>
      case 'FULFILLED': return <span className="status-badge status-fulfilled">🎉 Fulfilled</span>
      case 'REJECTED': return <span className="status-badge status-rejected">✕ Denied</span>
      default: return <span className="status-badge">{status}</span>
    }
  }

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Beneficiary Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Real-time medication requests and fulfillment tracking from MySQL
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-secondary"
          >
            {refreshing ? 'Refreshing...' : '🔄 Refresh DB'}
          </button>
          <button
            onClick={() => setActivePage('available')}
            className="btn btn-secondary"
          >
            🔍 Browse Available Stock
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            + Request Medicine
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* 4 Stat Cards Querying Database Dynamically */}
      <div className="stats-grid">
        <StatCard
          title="Total Requests"
          value={stats?.totalRequests ?? 0}
          icon="📋"
          iconBg="#e0f2fe"
          iconColor="#0284c7"
          subtext="From MySQL database"
        />
        <StatCard
          title="Pending Requests"
          value={stats?.pendingRequests ?? 0}
          icon="⏳"
          iconBg="#fef3c7"
          iconColor="#b45309"
          subtext="Under pharmacist review"
        />
        <StatCard
          title="Approved Requests"
          value={stats?.approvedRequests ?? 0}
          icon="✅"
          iconBg="#dcfce7"
          iconColor="#15803d"
          subtext="Allocated for dispatch"
        />
        <StatCard
          title="Fulfilled Requests"
          value={stats?.fulfilledRequests ?? 0}
          icon="🎉"
          iconBg="#e0e7ff"
          iconColor="#4338ca"
          subtext="Delivered successfully"
        />
      </div>

      {/* Requests Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
            My Prescription Requests ({requests.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Live records from table: <code>medicine_requests</code>
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading requests from database...
          </div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📋</div>
            <p>You have not submitted any prescription medicine requests yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '14px' }}
            >
              Submit Your First Request
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Requested Medicine</th>
                  <th>Quantity</th>
                  <th>Urgency</th>
                  <th>Medical Reason</th>
                  <th>Matched Donation</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.medicineName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Request #{item.id}
                      </div>
                    </td>
                    <td>
                      <strong>{item.quantityRequested}</strong> units
                    </td>
                    <td>{getUrgencyBadge(item.urgencyLevel)}</td>
                    <td style={{ maxWidth: '240px' }}>
                      <div style={{ fontSize: '0.85rem' }}>{item.reason || 'Not specified'}</div>
                      {item.adminNotes && (
                        <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '4px' }}>
                          Note: {item.adminNotes}
                        </div>
                      )}
                    </td>
                    <td>
                      {item.matchedDonationMedicine ? (
                        <span className="status-badge status-approved">
                          Matched: {item.matchedDonationMedicine}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Awaiting stock</span>
                      )}
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: New Request Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Submit Medicine Request</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ fontSize: '1.4rem', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest}>
              <div className="form-group">
                <label className="form-label">Required Medicine Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Metformin 850mg, Amoxicillin 500mg"
                  value={formData.medicineName}
                  onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Quantity Needed *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    className="form-control"
                    value={formData.quantityRequested}
                    onChange={(e) => setFormData({ ...formData, quantityRequested: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Urgency Level</label>
                  <select
                    className="form-control"
                    value={formData.urgencyLevel}
                    onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                  >
                    <option value="LOW">Low - Routine Stock</option>
                    <option value="MEDIUM">Medium - Standard Prescription</option>
                    <option value="HIGH">High - Acute Condition</option>
                    <option value="CRITICAL">Critical - Life-Sustaining Emergency</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Diagnosis / Reason for Request</label>
                <textarea
                  className="form-control"
                  rows={3}
                  required
                  placeholder="Describe patient condition and dosage instructions as per physician..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prescription Document URL (optional)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/prescription.pdf"
                  value={formData.prescriptionProofUrl}
                  onChange={(e) => setFormData({ ...formData, prescriptionProofUrl: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Submitting to MySQL...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
