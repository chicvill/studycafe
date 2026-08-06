import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SeatMapPage from './pages/SeatMapPage';
import SelfStudyPage from './pages/SelfStudyPage';
import AdminPage from './pages/AdminPage';
import { Sparkles, LayoutGrid } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('seats');
  const [systemStatus, setSystemStatus] = useState(null);

  // Check URL pathname for direct dedicated views
  const path = window.location.pathname.toLowerCase();
  const isDedicatedSelfStudy = path === '/selfstudy' || path.startsWith('/selfstudy/');
  const isDedicatedKiosk = path === '/kiosk' || path.startsWith('/kiosk/');

  useEffect(() => {
    fetch('/api/system-status')
      .then((res) => res.json())
      .then((data) => setSystemStatus(data))
      .catch((err) => console.error('Error fetching system status:', err));
  }, []);

  // 1. Dedicated Student SelfStudy View (No Admin Navbar)
  if (isDedicatedSelfStudy) {
    return (
      <div className="app-container">
        <header style={{
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles color="#c084fc" size={24} />
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f8fafc' }}>
              MQnet SelfStudy 학생 전용 케어 센터
            </h1>
          </div>
          <span className="badge badge-standalone">STUDENT MODE</span>
        </header>
        <main className="main-content">
          <SelfStudyPage />
        </main>
      </div>
    );
  }

  // 2. Dedicated Kiosk Mode View
  if (isDedicatedKiosk) {
    return (
      <div className="app-container">
        <header style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LayoutGrid color="#60a5fa" size={24} />
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f8fafc' }}>
              MQnet 무인 키오스크 입출실
            </h1>
          </div>
          <span className="badge badge-saas">KIOSK MODE</span>
        </header>
        <main className="main-content">
          <SeatMapPage />
        </main>
      </div>
    );
  }

  // 3. Full Integrated Manager View (Default for / or /admin)
  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
      />
      <main className="main-content">
        {activeTab === 'seats' && <SeatMapPage />}
        {activeTab === 'selfstudy' && <SelfStudyPage />}
        {activeTab === 'admin' && <AdminPage systemStatus={systemStatus} />}
      </main>
    </div>
  );
}
