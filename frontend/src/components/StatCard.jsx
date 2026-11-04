import React from 'react'

export default function StatCard({ title, value, icon, iconBg = '#ecfdf5', iconColor = '#059669', subtext }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <h4>{title}</h4>
        <div className="stat-number">{value ?? 0}</div>
        {subtext && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{subtext}</div>}
      </div>
      <div className="stat-icon" style={{ backgroundColor: iconBg, color: iconColor }}>
        {icon}
      </div>
    </div>
  )
}
