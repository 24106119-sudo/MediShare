import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import StatCard from '../components/StatCard'

export default function DonorDashboardPage() {
  const [stats, setStats] = useState(null)
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Modal form state
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    medicineName: '',
    genericName: '',
    category: 'Analgesic',
    quantity: 10,
    unit: 'tablets',
    expiryDate: '',
    batchNumber: '',
    manufacturer: '',
    storageCondition: 'Store below 25°C',
    conditionNotes: '',
    pickupAddress: ''
  })

  const loadData = async () => {
    setError('')
    try {
      const [dashData, myDonations] = await Promise.all([
        api.getDonorDashboard(),
        api.getMyDonations()
      ])
      setStats(dashData)
      setDonations(myDonations)
    } catch (err) {
      setError(err.message || 'Failed to fetch donor data from database')
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

  const handleCreateDonation = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await api.createDonation(formData)
      setSuccess(`Donation "${formData.medicineName}" saved to MySQL successfully!`)
      setShowModal(false)
      setFormData({
        medicineName: '',
        genericName: '',
        category: 'Analgesic',
        quantity: 10,
        unit: 'tablets',
        expiryDate: '',
        batchNumber: '',
        manufacturer: '',
        storageCondition: 'Store below 25°C',
        conditionNotes: '',
        pickupAddress: ''
      })
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to save donation to database')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return
    try {
      await api.deleteDonation(id)
      setSuccess(`Donation "${name}" removed from database.`)
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to delete record')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED': return <span className="status-badge status-approved">✓ Approved</span>
      case 'PENDING': return <span className="status-badge status-pending">⏳ Pending Review</span>
      case 'COMPLETED':
      case 'COLLECTED': return <span className="status-badge status-completed">📦 Distributed</span>
      case 'REJECTED': return <span className="status-badge status-rejected">✕ Rejected</span>
      default: return <span className="status-badge">{status}</span>
    }
  }

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Donor Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Track and submit medicine donations with live MySQL database sync
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
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            + Donate Medicine
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
          title="Total Donations"
          value={stats?.totalDonations ?? 0}
          icon="📦"
          iconBg="#ecfdf5"
          iconColor="#059669"
          subtext="From MySQL database"
        />
        <StatCard
          title="Pending Review"
          value={stats?.pendingDonations ?? 0}
          icon="⏳"
          iconBg="#fef3c7"
          iconColor="#b45309"
          subtext="Awaiting pharmacist review"
        />
        <StatCard
          title="Approved Stock"
          value={stats?.approvedDonations ?? 0}
          icon="✅"
          iconBg="#dcfce7"
          iconColor="#15803d"
          subtext="Available for beneficiaries"
        />
        <StatCard
          title="Completed Donations"
          value={stats?.completedDonations ?? 0}
          icon="🚚"
          iconBg="#e0e7ff"
          iconColor="#4338ca"
          subtext="Fulfilled & delivered"
        />
      </div>

      {/* Donations Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>
            My Donated Medicines ({donations.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Live records from table: <code>medicine_donations</code>
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading records from MySQL...
          </div>
        ) : donations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📦</div>
            <p>You have not registered any medicine donations yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '14px' }}
            >
              Submit Your First Donation
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Quantity</th>
                  <th>Batch #</th>
                  <th>Expiry Date</th>
                  <th>Storage</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.medicineName}</strong>
                      {item.genericName && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {item.genericName}
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{item.quantity}</strong> {item.unit}
                    </td>
                    <td><code>{item.batchNumber || 'N/A'}</code></td>
                    <td>{item.expiryDate}</td>
                    <td>{item.storageCondition || 'Ambient'}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(item.id, item.medicineName)}
                        className="btn btn-danger btn-sm"
                        title="Delete donation"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: New Donation Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Submit Medicine Donation</h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ fontSize: '1.4rem', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDonation}>
              <div className="form-group">
                <label className="form-label">Medicine Brand Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Paracetamol 500mg, Amoxicillin 250mg"
                  value={formData.medicineName}
                  onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Generic Name / Active Chemical</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Acetaminophen"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Analgesic">Analgesic / Painkiller</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="Antacid">Antacid / Gastrointestinal</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Antihistamine">Antihistamine</option>
                    <option value="Vitamin">Vitamin / Supplement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Quantity *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    className="form-control"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit Type</label>
                  <select
                    className="form-control"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <option value="tablets">Tablets</option>
                    <option value="capsules">Capsules</option>
                    <option value="bottles">Bottles (Syrup/Suspension)</option>
                    <option value="strips">Strips</option>
                    <option value="vials">Vials / Injections</option>
                    <option value="tubes">Ointment Tubes</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    className="form-control"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Batch / Lot Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. BATCH-99210"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Manufacturer</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. GSK, Pfizer, Novartis"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Storage Conditions</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Store below 25°C, cool dry place"
                    value={formData.storageCondition}
                    onChange={(e) => setFormData({ ...formData, storageCondition: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Packaging & Condition Notes</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="e.g. Factory sealed blisters, undamaged outer packaging"
                  value={formData.conditionNotes}
                  onChange={(e) => setFormData({ ...formData, conditionNotes: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pickup Address / Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Leave empty to use profile address"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
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
                  {submitting ? 'Saving to Database...' : 'Save & Submit Donation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
