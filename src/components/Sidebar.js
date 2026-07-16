'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLeads } from '@/context/LeadContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { leads } = useLeads();
  const [mobileOpen, setMobileOpen] = useState(false);

  const hotLeads = leads.filter((l) => l.temperature === 'hot').length;

  const navItems = [
    {
      href: '/',
      icon: '📊',
      label: 'Dashboard',
      badge: null,
    },
    {
      href: '/kanban',
      icon: '🗂️',
      label: 'Pipeline',
      badge: leads.length,
    },
  ];

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      <div
        className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">R</div>
          <span className="sidebar-logo-text">Rioo</span>
          <span className="sidebar-logo-badge">v2</span>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">Main</div>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${
                  pathname === item.href ? 'active' : ''
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                {item.label}
                {item.badge && (
                  <span className="sidebar-link-badge">{item.badge}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">Quick Stats</div>
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                }}
              >
                Hot Leads
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: 'var(--color-hot)',
                }}
              >
                {hotLeads}
              </span>
            </div>
            <div
              style={{
                height: '4px',
                borderRadius: '2px',
                background: 'var(--bg-elevated)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(hotLeads / leads.length) * 100}%`,
                  background:
                    'linear-gradient(90deg, var(--color-hot), var(--color-warm))',
                  borderRadius: '2px',
                  transition: 'width 600ms ease',
                }}
              />
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-footer-text">
            Rioo Revenue Engine v2
            <br />
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
              {leads.length} leads tracked
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
