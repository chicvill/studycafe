import React from 'react';
import { Cpu, ShieldCheck, Sparkles, LayoutGrid, Settings, ExternalLink } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, systemStatus }) {
  const isStandalone = systemStatus?.is_standalone;

  return (
    <nav style={{
      background: 'rgba(30, 41, 59, 0.9)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '1rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          MQnet StudyCafe
        </h1>
        <span className={isStandalone ? "badge badge-standalone" : "badge badge-saas"}>
          {isStandalone ? "N100 LOCAL STANDALONE" : "SAAS CLOUD PORTAL"}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('seats')}
          className="btn-primary"
          style={{ background: activeTab === 'seats' ? 'var(--accent-blue)' : 'transparent', border: '1px solid var(--border-color)' }}
        >
          <LayoutGrid size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          통합 좌석관리
        </button>

        {systemStatus?.enable_selfstudy && (
          <button
            onClick={() => setActiveTab('selfstudy')}
            className="btn-primary"
            style={{ background: activeTab === 'selfstudy' ? 'var(--accent-purple)' : 'transparent', border: '1px solid var(--border-color)' }}
          >
            <Sparkles size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            SelfStudy AI 케어센터
          </button>
        )}

        <button
          onClick={() => setActiveTab('admin')}
          className="btn-primary"
          style={{ background: activeTab === 'admin' ? 'var(--bg-card)' : 'transparent', border: '1px solid var(--border-color)' }}
        >
          <Settings size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          시스템 설정
        </button>

        <a
          href="/selfstudy"
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
          style={{ background: 'rgba(192, 132, 252, 0.15)', border: '1px solid var(--accent-purple)', color: '#c084fc', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
        >
          <ExternalLink size={14} style={{ marginRight: '4px' }} />
          학생전용창 (/selfstudy)
        </a>
      </div>
    </nav>
  );
}
