import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LayoutGrid, Sparkles, Settings, ExternalLink } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, systemStatus }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isStandalone = systemStatus?.is_standalone;

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  return (
    <nav style={{
      background: 'rgba(30, 41, 59, 0.9)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '0.85rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
      zIndex: 100
    }}>
      <div ref={menuRef} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
        {/* Hamburger Menu Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴 열기"
          style={{
            background: isMenuOpen ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            color: '#f8fafc',
            padding: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <h1 style={{ fontSize: '1.3rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
          MQnet StudyCafe
        </h1>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            left: 0,
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '0.6rem',
            width: '260px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            animation: 'fadeIn 0.15s ease-out'
          }}>
            <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '0.2rem' }}>
              시스템 메뉴
            </div>

            <button
              onClick={() => handleNavClick('seats')}
              className="btn-primary"
              style={{
                background: activeTab === 'seats' ? 'var(--accent-blue)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                justifyContent: 'flex-start',
                width: '100%',
                padding: '0.65rem 0.9rem',
                fontSize: '0.9rem',
                color: '#fff'
              }}
            >
              <LayoutGrid size={18} style={{ marginRight: '10px' }} />
              통합 좌석관리
            </button>

            {systemStatus?.enable_selfstudy && (
              <button
                onClick={() => handleNavClick('selfstudy')}
                className="btn-primary"
                style={{
                  background: activeTab === 'selfstudy' ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  justifyContent: 'flex-start',
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  fontSize: '0.9rem',
                  color: '#fff'
                }}
              >
                <Sparkles size={18} style={{ marginRight: '10px', color: '#c084fc' }} />
                SelfStudy AI 케어센터
              </button>
            )}

            <button
              onClick={() => handleNavClick('admin')}
              className="btn-primary"
              style={{
                background: activeTab === 'admin' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                justifyContent: 'flex-start',
                width: '100%',
                padding: '0.65rem 0.9rem',
                fontSize: '0.9rem',
                color: '#fff'
              }}
            >
              <Settings size={18} style={{ marginRight: '10px' }} />
              시스템 설정
            </button>

            <a
              href="/selfstudy"
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="btn-primary"
              style={{
                background: 'rgba(192, 132, 252, 0.15)',
                border: '1px solid var(--accent-purple)',
                color: '#c084fc',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                padding: '0.65rem 0.9rem',
                fontSize: '0.9rem'
              }}
            >
              <ExternalLink size={18} style={{ marginRight: '10px' }} />
              학생전용창 (/selfstudy)
            </a>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span className={isStandalone ? "badge badge-standalone" : "badge badge-saas"}>
          {isStandalone ? "N100 LOCAL STANDALONE" : "SAAS CLOUD PORTAL"}
        </span>
      </div>
    </nav>
  );
}
