import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import StatCard from '../components/StatCard'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [donations, setDonations] = useState([])
  const [requests, setRequests] = useState([])
  const [users, setUsers] = useState([])
  const [expiredList, setExpiredList] = useState([])
  const [logs, setLogs] = useState([])
  const [activeTab, setActiveTab] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadData = async () => {
    setError('')
    try {
      const [
        dashStats,
        allDonations,
        allRequests,
        allUsers,
        allExpired,
        allLogs
      ] = await Promise.all([
        api.getAdminDashboard(),
        api.getAllDonations(),
        api.getAllRequests(),
        api.getAllUsers(),
        api.getExpiredMedicines(),
        api.getActivityLogs()
      ])

      setStats(dashStats)
      setDonations(allDonations)
      setRequests(allRequests)
      setUsers(allUsers)
      setExpiredList(allExpired)
      setLogs(allLogs)
    } catch (err) {
      setError(err.message || 'Failed to load administrator data from MySQL')
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

  const handleApproveDonation = async (id, name) => {
    setError('')
    setSuccess('')
    try {
      await api.updateDonationStatus(id, 'APPROVED', 'Verified by Admin')
      setSuccess(`Donation #${id} (${name}) status updated to APPROVED in MySQL!`)
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to approve donation')
    }
  }

  const handleRejectDonation = async (id, name) => {
    setError('')
    setSuccess('')
    try {
      await api.updateDonationStatus(id, 'REJECTED', 'Rejected during admin quality check')
      setSuccess(`Donation #${id} (${name}) marked as REJECTED in MySQL.`)
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to reject donation')
    }
  }

  const handleApproveRequest = async (id, name) => {
    setError('')
    setSuccess('')
    try {
      await api.updateRequestStatus(id, 'APPROVED', null, 'Authorized by medical reviewer')
      setSuccess(`Request #${id} (${name}) APPROVED in MySQL!`)
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to approve request')
    }
  }

  const handleFulfillRequest = async (id, name) => {
    setError('')
    setSuccess('')
    try {
      await api.updateRequestStatus(id, 'FULFILLED', null, 'Dispatched to beneficiary')
      setSuccess(`Request #${id} (${name}) marked FULFILLED in MySQL!`)
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to fulfill request')
    }
  }

  const handleToggleNgoVerify = async (userId, orgName, currentStatus) => {
    setError('')
    setSuccess('')
    try {
      await api.verifyNgo(userId, !currentStatus)
      setSuccess(`NGO "${orgName}" verification set to ${!currentStatus} in MySQL!`)
      await loadData()
    } catch (err) {
      setError(err.message || 'Failed to update NGO verification')
    }
  }

  const pendingDonations = donations.filter(d => d.status === 'PENDING')
  const pendingRequests = requests.filter(r => r.status === 'PENDING')

  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#991b1b', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
            <span>🔒</span>
            <span>Administrator Authorized Session</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Real-time MySQL operational command center and quality assurance
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn btn-secondary"
        >
          {refreshing ? 'Refreshing...' : '🔄 Refresh DB Metrics'}
        </button>
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

      {/* 6 Stat Cards Directly Querying Database - No Hardcoded Values */}
      <div className="stats-grid">
        <StatCard
          title="Total Registered Users"
          value={stats?.totalRegisteredUsers ?? 0}
          icon="👥"
          iconBg="#e0f2fe"
          iconColor="#0284c7"
          subtext="users table count"
        />
        <StatCard
          title="Total Donations"
          value={stats?.totalDonations ?? 0}
          icon="💊"
          iconBg="#ecfdf5"
          iconColor="#059669"
          subtext="medicine_donations count"
        />
        <StatCard
          title="Total Requests"
          value={stats?.totalRequests ?? 0}
          icon="📋"
          iconBg="#f3e8ff"
          iconColor="#7e22ce"
          subtext="medicine_requests count"
        />
        <StatCard
          title="Verified NGOs"
          value={stats?.verifiedNgos ?? 0}
          icon="🏢"
          iconBg="#dcfce7"
          iconColor="#15803d"
          subtext="is_verified = TRUE"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals ?? 0}
          icon="⏳"
          iconBg="#fef3c7"
          iconColor="#b45309"
          subtext="Donations, requests, NGOs"
        />
        <StatCard
          title="Expired Medicine Records"
          value={stats?.expiredMedicineRecords ?? 0}
          icon="⚠️"
          iconBg="#fee2e2"
          iconColor="#991b1b"
          subtext="expiry_date < TODAY"
        />
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ Pending Approvals ({pendingDonations.length + pendingRequests.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
          onClick={() => setActiveTab('donations')}
        >
          📦 All Donations ({donations.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📋 All Requests ({requests.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users & NGOs ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'expired' ? 'active' : ''}`}
          onClick={() => setActiveTab('expired')}
        >
          🚫 Expired Medicines ({expiredList.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          📜 Audit Trail ({logs.length})
        </button>
      </div>

      {/* Tab 1: Pending Approvals */}
      {activeTab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Pending Donations */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px' }}>
              Pending Medicine Donations Awaiting Admin Quality Check ({pendingDonations.length})
            </h3>
            {pendingDonations.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', padding: '20px', textAlign: 'center' }}>
                ✓ No pending donations waiting for approval.
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Medicine</th>
                      <th>Donor</th>
                      <th>Quantity</th>
                      <th>Batch & Expiry</th>
                      <th>Conditions / Notes</th>
                      <th>Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingDonations.map(d => (
                      <tr key={d.id}>
                        <td>#{d.id}</td>
                        <td>
                          <strong>{d.medicineName}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.category}</div>
                        </td>
                        <td>
                          <div>{d.donorName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.donorEmail}</div>
                        </td>
                        <td><strong>{d.quantity}</strong> {d.unit}</td>
                        <td>
                          <div>Batch: <code>{d.batchNumber || 'N/A'}</code></div>
                          <div style={{ fontSize: '0.75rem', color: '#059669' }}>Exp: {d.expiryDate}</div>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{d.conditionNotes || 'No notes'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => handleApproveDonation(d.id, d.medicineName)}
                              className="btn btn-primary btn-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectDonation(d.id, d.medicineName)}
                              className="btn btn-danger btn-sm"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pending Requests */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px' }}>
              Pending Medicine Requests Awaiting Review ({pendingRequests.length})
            </h3>
            {pendingRequests.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', padding: '20px', textAlign: 'center' }}>
                ✓ No pending requests waiting for approval.
              </div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Requested Medicine</th>
                      <th>Beneficiary</th>
                      <th>Quantity</th>
                      <th>Urgency</th>
                      <th>Reason</th>
                      <th>Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map(r => (
                      <tr key={r.id}>
                        <td>#{r.id}</td>
                        <td><strong>{r.medicineName}</strong></td>
                        <td>
                          <div>{r.beneficiaryName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.beneficiaryEmail}</div>
                        </td>
                        <td><strong>{r.quantityRequested}</strong> units</td>
                        <td>
                          <span className="status-badge" style={{ background: '#fef3c7', color: '#b45309' }}>
                            {r.urgencyLevel}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{r.reason}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => handleApproveRequest(r.id, r.medicineName)}
                              className="btn btn-primary btn-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleFulfillRequest(r.id, r.medicineName)}
                              className="btn btn-secondary btn-sm"
                            >
                              Fulfill
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: All Donations */}
      {activeTab === 'donations' && (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px' }}>
            All Medicine Inventory Records in MySQL ({donations.length})
          </h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Medicine</th>
                  <th>Donor</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d.id}>
                    <td>#{d.id}</td>
                    <td>
                      <strong>{d.medicineName}</strong>
                      {d.batchNumber && <div style={{ fontSize: '0.75rem' }}>Batch: {d.batchNumber}</div>}
                    </td>
                    <td>{d.donorName}</td>
                    <td>{d.quantity} {d.unit}</td>
                    <td>{d.expiryDate}</td>
                    <td>
                      <span className={`status-badge status-${d.status.toLowerCase()}`}>
                        {d.status}
                      </span>
                    </td>
                    <td>
                      {d.status === 'PENDING' && (
                        <button
                          onClick={() => handleApproveDonation(d.id, d.medicineName)}
                          className="btn btn-primary btn-sm"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: All Requests */}
      {activeTab === 'requests' && (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px' }}>
            All Patient & Clinic Requests in MySQL ({requests.length})
          </h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Medicine</th>
                  <th>Beneficiary</th>
                  <th>Qty</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td><strong>{r.medicineName}</strong></td>
                    <td>{r.beneficiaryName}</td>
                    <td>{r.quantityRequested}</td>
                    <td>{r.urgencyLevel}</td>
                    <td>
                      <span className={`status-badge status-${r.status.toLowerCase()}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status === 'APPROVED' && (
                        <button
                          onClick={() => handleFulfillRequest(r.id, r.medicineName)}
                          className="btn btn-secondary btn-sm"
                        >
                          Mark Fulfilled
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Users & NGOs */}
      {activeTab === 'users' && (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px' }}>
            Registered Users & Organizations in MySQL ({users.length})
          </h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name / Contact</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Organization</th>
                  <th>NGO Verification</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td><strong>{u.fullName}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-pill role-${u.role.replace('ROLE_', '').toLowerCase()}`}>
                        {u.role.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td>{u.organizationName || '—'}</td>
                    <td>
                      {u.role === 'ROLE_NGO' ? (
                        u.isVerified ? (
                          <span className="status-badge status-approved">✓ Verified NGO</span>
                        ) : (
                          <span className="status-badge status-pending">⏳ Pending Verification</span>
                        )
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                      )}
                    </td>
                    <td>
                      {u.role === 'ROLE_NGO' && (
                        <button
                          onClick={() => handleToggleNgoVerify(u.id, u.organizationName || u.fullName, u.isVerified)}
                          className={u.isVerified ? 'btn btn-danger btn-sm' : 'btn btn-primary btn-sm'}
                        >
                          {u.isVerified ? 'Revoke Verification' : 'Verify NGO'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Expired Medicines Quarantine */}
      {activeTab === 'expired' && (
        <div className="card">
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#991b1b' }}>
              🚫 Expired Medicine Quarantine Audit ({expiredList.length})
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Records queried dynamically where <code>expiry_date &lt; CURRENT_DATE</code>. These medications are prevented from distribution to ensure patient safety.
            </p>
          </div>

          {expiredList.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No expired medications found in the database.
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Record ID</th>
                    <th>Medicine</th>
                    <th>Batch #</th>
                    <th>Manufacturer</th>
                    <th>Expired On</th>
                    <th>Quarantine Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expiredList.map(item => (
                    <tr key={item.id} style={{ background: '#fff5f5' }}>
                      <td>#{item.id}</td>
                      <td>
                        <strong style={{ color: '#991b1b' }}>{item.medicineName}</strong>
                        <div style={{ fontSize: '0.75rem' }}>Qty: {item.quantity} {item.unit}</div>
                      </td>
                      <td><code>{item.batchNumber || 'N/A'}</code></td>
                      <td>{item.manufacturer || 'Unknown'}</td>
                      <td>
                        <strong style={{ color: '#dc2626' }}>{item.expiryDate} (EXPIRED)</strong>
                      </td>
                      <td>
                        <span className="status-badge status-rejected">
                          QUARANTINED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Audit Trail */}
      {activeTab === 'logs' && (
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '14px' }}>
            System Activity Audit Trail ({logs.length})
          </h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Actor</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <code>{log.action}</code>
                    </td>
                    <td>{log.performedBy}</td>
                    <td>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
