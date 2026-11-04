import React from 'react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
            MediShare Healthcare Platform
          </div>
          <div>Redistributing surplus medicines safely with verified quality control.</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>Backend: <strong>Kotlin + Spring Boot 3 + MySQL 8</strong></div>
          <div>Database Pooling: <strong>HikariCP</strong> | ORM: <strong>Hibernate</strong></div>
        </div>
      </div>
    </footer>
  )
}
