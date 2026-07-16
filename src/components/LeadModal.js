'use client';

import { useEffect, useCallback } from 'react';
import { STAGES, STAGE_COLORS } from '@/data/dummyData';

function getScoreColor(score) {
  if (score >= 70) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function getScoreGradient(score) {
  if (score >= 70)
    return 'linear-gradient(135deg, #22c55e, #06d6a0)';
  if (score >= 50)
    return 'linear-gradient(135deg, #f59e0b, #fbbf24)';
  return 'linear-gradient(135deg, #ef4444, #f87171)';
}

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarGradient(name) {
  const gradients = [
    'linear-gradient(135deg, #06d6a0, #22d3ee)',
    'linear-gradient(135deg, #8b5cf6, #a855f7)',
    'linear-gradient(135deg, #3b82f6, #6366f1)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #10b981, #06d6a0)',
    'linear-gradient(135deg, #ec4899, #a855f7)',
  ];
  const index =
    name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    gradients.length;
  return gradients[index];
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function LeadModal({ lead, onClose }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  if (!lead) return null;

  const currentStageIndex = STAGES.indexOf(lead.stage);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div
              className="modal-avatar"
              style={{ background: getAvatarGradient(lead.name) }}
            >
              {getInitials(lead.name)}
            </div>
            <div>
              <h2 className="modal-name">{lead.name}</h2>
              <p className="modal-title-company">
                {lead.title} at {lead.company}
              </p>
              <div className="modal-badges">
                <span
                  className={`badge badge-stage badge-stage-${lead.stage.toLowerCase()}`}
                >
                  {lead.stage}
                </span>
                <span className={`badge badge-priority-${lead.priority}`}>
                  ● {lead.priority}
                </span>
                <span className={`badge badge-temp-${lead.temperature}`}>
                  {lead.temperature === 'hot'
                    ? '🔥'
                    : lead.temperature === 'warm'
                    ? '☀️'
                    : '❄️'}{' '}
                  {lead.temperature}
                </span>
                <span className="badge" style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>
                  {lead.category}
                </span>
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Score Section */}
          <div className="modal-section">
            <div className="modal-section-title">AI Qualification Score</div>
            <div className="score-gauge">
              <div
                className="score-circle"
                style={{ background: getScoreGradient(lead.score) }}
              >
                <span style={{ color: lead.score >= 50 ? '#0a0f1e' : '#fff' }}>
                  {lead.score}
                </span>
              </div>
              <div className="score-details">
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    className={`badge badge-priority-${lead.priority}`}
                  >
                    Priority: {lead.priority}
                  </span>
                  <span className={`badge badge-temp-${lead.temperature}`}>
                    Temp: {lead.temperature}
                  </span>
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(6, 214, 160, 0.1)',
                      color: '#06d6a0',
                    }}
                  >
                    Action: {lead.recommended_action?.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="score-reasoning">
                  <strong style={{ color: 'var(--text-primary)' }}>
                    AI Reasoning:
                  </strong>{' '}
                  {lead.reasoning}
                </p>
              </div>
            </div>
          </div>

          {/* Pain Point */}
          {lead.pain_point && (
            <div className="modal-section">
              <div className="modal-section-title">Pain Point</div>
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card)',
                  borderLeft: '3px solid var(--accent-primary)',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{lead.pain_point}&rdquo;
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="modal-section">
            <div className="modal-section-title">Contact Information</div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Email</div>
                <div className="info-value">
                  <a href={`mailto:${lead.email}`}>{lead.email}</a>
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">LinkedIn</div>
                <div className="info-value">
                  <a
                    href={lead.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Profile ↗
                  </a>
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Followers</div>
                <div className="info-value">
                  {lead.followers?.toLocaleString()}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Source</div>
                <div className="info-value">
                  {lead.source === 'linkedin_apify'
                    ? '🔗 LinkedIn (Apify)'
                    : '✋ Manual'}
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Timeline */}
          <div className="modal-section">
            <div className="modal-section-title">Pipeline Stage</div>
            <div className="pipeline-timeline">
              {STAGES.map((stage, i) => {
                const isCompleted = i < currentStageIndex;
                const isActive = i === currentStageIndex;
                return (
                  <div className="pipeline-step" key={stage}>
                    <div className="pipeline-step-wrapper">
                      <div
                        className={`pipeline-dot ${
                          isActive ? 'active' : isCompleted ? 'completed' : ''
                        }`}
                      >
                        {isCompleted ? '✓' : i + 1}
                      </div>
                      <div
                        className={`pipeline-label ${isActive ? 'active' : ''}`}
                      >
                        {stage}
                      </div>
                    </div>
                    {i < STAGES.length - 1 && (
                      <div
                        className={`pipeline-line ${
                          isCompleted ? 'completed' : ''
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracking */}
          <div className="modal-section">
            <div className="modal-section-title">Tracking</div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Status</div>
                <div className="info-value">{lead.status}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Follow-ups Sent</div>
                <div className="info-value">{lead.follow_up_count}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Last Contacted</div>
                <div className="info-value">
                  {formatDate(lead.last_contacted)}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Created At</div>
                <div className="info-value">
                  {formatDate(lead.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* AI Email */}
          {lead.ai_email_subject && (
            <div className="modal-section">
              <div className="modal-section-title">
                AI-Generated Outreach Email
              </div>
              <div className="email-preview">
                <div className="email-preview-header">
                  <div
                    className="email-preview-dot"
                    style={{ background: '#ef4444' }}
                  />
                  <div
                    className="email-preview-dot"
                    style={{ background: '#f59e0b' }}
                  />
                  <div
                    className="email-preview-dot"
                    style={{ background: '#22c55e' }}
                  />
                  <span className="email-preview-subject">
                    {lead.ai_email_subject}
                  </span>
                </div>
                <div className="email-preview-body">{lead.ai_email_body}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
