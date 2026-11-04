const API_BASE = '/api'

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function request(endpoint, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || (data?.details ? Object.values(data.details).join(', ') : 'Network request failed')
    throw new Error(errorMsg)
  }

  return data
}

export const api = {
  // Authentication
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),

  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),

  getCurrentUser: () => request('/auth/me'),

  // Donations
  createDonation: (donationData) => request('/donations', {
    method: 'POST',
    body: JSON.stringify(donationData)
  }),

  getMyDonations: () => request('/donations/my'),

  getAvailableDonations: () => request('/donations/available'),

  getAllDonations: () => request('/donations'),

  getDonationById: (id) => request(`/donations/${id}`),

  updateDonationStatus: (id, status, notes) => request(`/donations/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes })
  }),

  deleteDonation: (id) => request(`/donations/${id}`, {
    method: 'DELETE'
  }),

  // Requests
  createRequest: (requestData) => request('/requests', {
    method: 'POST',
    body: JSON.stringify(requestData)
  }),

  getMyRequests: () => request('/requests/my'),

  getAllRequests: () => request('/requests'),

  getRequestById: (id) => request(`/requests/${id}`),

  updateRequestStatus: (id, status, matchedDonationId, adminNotes) => request(`/requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, matchedDonationId, adminNotes })
  }),

  // Dashboards (All metrics computed dynamically from database!)
  getDonorDashboard: () => request('/dashboard/donor'),

  getBeneficiaryDashboard: () => request('/dashboard/beneficiary'),

  getAdminDashboard: () => request('/dashboard/admin'),

  // Admin Tools
  getAllUsers: () => request('/admin/users'),

  verifyNgo: (userId, verified) => request(`/admin/users/${userId}/verify?verified=${verified}`, {
    method: 'PATCH'
  }),

  getExpiredMedicines: () => request('/admin/expired-medicines'),

  getActivityLogs: () => request('/admin/logs'),

  // Health
  getHealth: () => request('/health')
}
