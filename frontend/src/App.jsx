import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SeatMapPage from './pages/SeatMapPage';
import SelfStudyPage from './pages/SelfStudyPage';
import AdminPage from './pages/AdminPage';

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

  // 1. Dedicated Student SelfStudy View (With Hamburger Navbar)
  if (isDedicatedSelfStudy) {
    return (
      <div className="app-container">
        <Navbar
          systemStatus={systemStatus}
          title="MQnet SelfStudy 학생 전용 케어 센터"
          badgeText="STUDENT MODE"
          badgeClass="badge badge-standalone"
        />
        <main className="main-content">
          <SelfStudyPage />
        </main>
      </div>
    );
  }

  // 2. Dedicated Kiosk Mode View (With Hamburger Navbar)
  if (isDedicatedKiosk) {
    return (
      <div className="app-container">
        <Navbar
          systemStatus={systemStatus}
          title="MQnet 무인 키오스크 입출실"
          badgeText="KIOSK MODE"
          badgeClass="badge badge-saas"
        />
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
        title="MQnet StudyCafe"
      />
      <main className="main-content">
        {activeTab === 'seats' && <SeatMapPage />}
        {activeTab === 'selfstudy' && <SelfStudyPage />}
        {activeTab === 'admin' && <AdminPage systemStatus={systemStatus} />}
      </main>
    </div>
  );
}
