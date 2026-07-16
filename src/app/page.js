'use client';

import { useState, useMemo } from 'react';
import { useLeads } from '@/context/LeadContext';
import {
  StageChart,
  ScoreDistributionChart,
  PriorityChart,
  TemperatureChart,
  CategoryChart,
  SourceChart,
  TimelineChart,
} from '@/components/Charts';
import LeadModal from '@/components/LeadModal';

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

export default function DashboardPage() {
  const { leads } = useLeads();
  const [selectedLead, setSelectedLead] = useState(null);
  const [stageFilter, setStageFilter] = useState('All');
  const [sortField, setSortField] = useState('score');
  const [sortDir, setSortDir] = useState('desc');

  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const avgScore = Math.round(
      leads.reduce((sum, l) => sum + l.score, 0) / totalLeads
    );
    const hotLeads = leads.filter((l) => l.temperature === 'hot').length;
    const hotPct = Math.round((hotLeads / totalLeads) * 100);
    const bookedOrClosed = leads.filter(
      (l) => l.stage === 'Booked' || l.stage === 'Closed'
    ).length;
    const conversionRate = Math.round((bookedOrClosed / totalLeads) * 100);
    const contacted = leads.filter(
      (l) => l.status !== 'New'
    ).length;
    const contactedPct = Math.round((contacted / totalLeads) * 100);

    return {
      totalLeads,
      avgScore,
      hotPct,
      hotLeads,
      conversionRate,
      bookedOrClosed,
      contactedPct,
      contacted,
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let filtered =
      stageFilter === 'All'
        ? [...leads]
        : leads.filter((l) => l.stage === stageFilter);

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [leads, stageFilter, sortField, sortDir]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const stages = ['All', 'New', 'Qualified', 'Contacted', 'Replied', 'Interested', 'Booked', 'Closed'];

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Lead Analytics</h1>
        <p className="page-subtitle">
          Rioo Revenue Engine — Real-time pipeline intelligence
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div
          className="glass-card stat-card animate-in delay-1"
          style={{ '--stat-accent': '#06d6a0' }}
        >
          <div className="stat-card-icon">📊</div>
          <div className="stat-card-value">{stats.totalLeads}</div>
          <div className="stat-card-label">Total Leads</div>
          <div className="stat-card-change positive">↑ Active pipeline</div>
        </div>

        <div
          className="glass-card stat-card animate-in delay-2"
          style={{ '--stat-accent': '#8b5cf6' }}
        >
          <div className="stat-card-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>🎯</div>
          <div className="stat-card-value">{stats.avgScore}</div>
          <div className="stat-card-label">Avg Score</div>
          <div className="stat-card-change positive">↑ Quality leads</div>
        </div>

        <div
          className="glass-card stat-card animate-in delay-3"
          style={{ '--stat-accent': '#ef4444' }}
        >
          <div className="stat-card-icon" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>🔥</div>
          <div className="stat-card-value">
            {stats.hotPct}
            <span style={{ fontSize: '18px', fontWeight: 600 }}>%</span>
          </div>
          <div className="stat-card-label">Hot Leads</div>
          <div className="stat-card-change positive">
            {stats.hotLeads} leads
          </div>
        </div>

        <div
          className="glass-card stat-card animate-in delay-4"
          style={{ '--stat-accent': '#22c55e' }}
        >
          <div className="stat-card-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>💰</div>
          <div className="stat-card-value">
            {stats.conversionRate}
            <span style={{ fontSize: '18px', fontWeight: 600 }}>%</span>
          </div>
          <div className="stat-card-label">Conversion</div>
          <div className="stat-card-change positive">
            {stats.bookedOrClosed} booked/closed
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="glass-card chart-card animate-in delay-2">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Lead Timeline</div>
              <div className="chart-card-subtitle">
                Cumulative growth over time
              </div>
            </div>
          </div>
          <div className="chart-wrapper">
            <TimelineChart leads={leads} />
          </div>
        </div>

        <div className="glass-card chart-card animate-in delay-3">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Pipeline Stages</div>
              <div className="chart-card-subtitle">
                Leads by current stage
              </div>
            </div>
          </div>
          <div className="chart-wrapper">
            <StageChart leads={leads} />
          </div>
        </div>

        <div className="glass-card chart-card animate-in delay-4">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Score Distribution</div>
              <div className="chart-card-subtitle">
                AI qualification score ranges
              </div>
            </div>
          </div>
          <div className="chart-wrapper">
            <ScoreDistributionChart leads={leads} />
          </div>
        </div>

        <div className="glass-card chart-card animate-in delay-5">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Category Split</div>
              <div className="chart-card-subtitle">
                Business category breakdown
              </div>
            </div>
          </div>
          <div className="chart-wrapper chart-wrapper-small">
            <CategoryChart leads={leads} />
          </div>
        </div>

        <div className="glass-card chart-card animate-in delay-5">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Priority & Temperature</div>
              <div className="chart-card-subtitle">
                Lead urgency breakdown
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <div className="chart-wrapper chart-wrapper-small">
              <PriorityChart leads={leads} />
            </div>
            <div className="chart-wrapper chart-wrapper-small">
              <TemperatureChart leads={leads} />
            </div>
          </div>
        </div>

        <div className="glass-card chart-card animate-in delay-6">
          <div className="chart-card-header">
            <div>
              <div className="chart-card-title">Lead Source</div>
              <div className="chart-card-subtitle">
                Acquisition channel breakdown
              </div>
            </div>
          </div>
          <div className="chart-wrapper chart-wrapper-small">
            <SourceChart leads={leads} />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="glass-card table-container animate-in delay-6">
        <div className="table-header-row">
          <h2 className="table-title">All Leads</h2>
          <div className="table-filters">
            {stages.map((stage) => (
              <button
                key={stage}
                className={`filter-btn ${stageFilter === stage ? 'active' : ''}`}
                onClick={() => setStageFilter(stage)}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <table className="leads-table" id="leads-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort('name')}
                style={{ cursor: 'pointer' }}
              >
                Lead {sortField === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => handleSort('score')}
                style={{ cursor: 'pointer' }}
              >
                Score{' '}
                {sortField === 'score' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Priority</th>
              <th>Temp</th>
              <th>Stage</th>
              <th>Category</th>
              <th>Source</th>
              <th
                onClick={() => handleSort('follow_up_count')}
                style={{ cursor: 'pointer' }}
              >
                Follow-ups{' '}
                {sortField === 'follow_up_count'
                  ? sortDir === 'asc'
                    ? '↑'
                    : '↓'
                  : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                id={`lead-row-${lead.id}`}
              >
                <td>
                  <div className="lead-name-cell">
                    <div
                      className="lead-avatar"
                      style={{
                        background: getAvatarGradient(lead.name),
                      }}
                    >
                      {getInitials(lead.name)}
                    </div>
                    <div className="lead-name-info">
                      <span className="lead-name-text">{lead.name}</span>
                      <span className="lead-company-text">
                        {lead.title} · {lead.company}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className={`score-badge ${
                      lead.score >= 70
                        ? 'score-high'
                        : lead.score >= 50
                        ? 'score-medium'
                        : 'score-low'
                    }`}
                  >
                    {lead.score}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-priority-${lead.priority}`}>
                    {lead.priority}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-temp-${lead.temperature}`}>
                    {lead.temperature === 'hot'
                      ? '🔥'
                      : lead.temperature === 'warm'
                      ? '☀️'
                      : '❄️'}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge badge-stage badge-stage-${lead.stage.toLowerCase()}`}
                  >
                    {lead.stage}
                  </span>
                </td>
                <td style={{ textTransform: 'capitalize' }}>
                  {lead.category}
                </td>
                <td>
                  <span style={{ fontSize: '12px' }}>
                    {lead.source === 'linkedin_apify' ? '🔗' : '✋'}
                  </span>
                </td>
                <td>{lead.follow_up_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </>
  );
}
