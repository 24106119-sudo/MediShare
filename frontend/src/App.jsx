import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DonorDashboardPage from './pages/DonorDashboardPage'
import BeneficiaryDashboardPage from './pages/BeneficiaryDashboardPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AvailableMedicinesPage from './pages/AvailableMedicinesPage'

function MainContent() {
  const { user, isAuthenticated, loading } = useAuth()
  const [activePage, setActivePage] = useState('home')

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💊</div>
          <div style={{ fontWeight: '600', color: 'var(--text-muted)' }}>
            Connecting to MediShare Database...
          </div>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage setActivePage={setActivePage} />
      case 'available':
        return <AvailableMedicinesPage setActivePage={setActivePage} />
      case 'login':
        return <LoginPage setActivePage={setActivePage} />
      case 'register':
        return <RegisterPage setActivePage={setActivePage} />
      case 'donor':
        if (!isAuthenticated) return <LoginPage setActivePage={setActivePage} />
        return <DonorDashboardPage />
      case 'beneficiary':
        if (!isAuthenticated) return <LoginPage setActivePage={setActivePage} />
        return <BeneficiaryDashboardPage setActivePage={setActivePage} />
      case 'admin':
        if (!isAuthenticated || user?.role !== 'ROLE_ADMIN') {
          return <LoginPage setActivePage={setActivePage} />
        }
        return <AdminDashboardPage />
      default:
        return <HomePage setActivePage={setActivePage} />
    }
  }

  return (
    <>
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  )
}
