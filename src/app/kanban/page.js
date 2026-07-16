'use client';

import { useState, useCallback } from 'react';
import { useLeads } from '@/context/LeadContext';
import { STAGES, STAGE_COLORS } from '@/data/dummyData';
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

export default function KanbanPage() {
  const { leads, updateStage } = useLeads();
  const [selectedLead, setSelectedLead] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  const handleDragStart = useCallback((e, leadId) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(leadId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverColumn(null);
  }, []);

  const handleDragOver = useCallback((e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(stage);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    (e, stage) => {
      e.preventDefault();
      const leadId = e.dataTransfer.getData('text/plain');
      if (leadId) {
        updateStage(leadId, stage);
      }
      setDragOverColumn(null);
      setDraggingId(null);
    },
    [updateStage]
  );

  const getStageLeads = useCallback(
    (stage) => leads.filter((l) => l.stage === stage),
    [leads]
  );

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Pipeline Board</h1>
        <p className="page-subtitle">
          Drag and drop leads between stages to update their pipeline position
        </p>
      </div>

      <div className="kanban-board">
        {STAGES.map((stage) => {
          const stageLeads = getStageLeads(stage);
          const color = STAGE_COLORS[stage];

          return (
            <div className="kanban-column" key={stage}>
              <div
                className="kanban-column-header glass-card"
                style={{
                  '--col-color': color,
                }}
              >
                <div
                  className="kanban-column-dot"
                  style={{ background: color }}
                />
                <span className="kanban-column-title">{stage}</span>
                <span className="kanban-column-count">
                  {stageLeads.length}
                </span>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: color,
                    borderRadius:
                      'var(--radius-lg) var(--radius-lg) 0 0',
                  }}
                />
              </div>

              <div
                className={`kanban-cards ${
                  dragOverColumn === stage ? 'drag-over' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage)}
              >
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`kanban-card ${
                      draggingId === lead.id ? 'dragging' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setSelectedLead(lead)}
                    id={`kanban-card-${lead.id}`}
                  >
                    <div className="kanban-card-header">
                      <div
                        className="kanban-card-avatar"
                        style={{
                          background: getAvatarGradient(lead.name),
                        }}
                      >
                        {getInitials(lead.name)}
                      </div>
                      <div>
                        <div className="kanban-card-name">{lead.name}</div>
                        <div className="kanban-card-company">
                          {lead.company}
                        </div>
                      </div>
                    </div>

                    <div className="kanban-card-meta">
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
                      <span
                        className={`badge badge-priority-${lead.priority}`}
                      >
                        {lead.priority}
                      </span>
                      <span
                        className={`badge badge-temp-${lead.temperature}`}
                      >
                        {lead.temperature === 'hot'
                          ? '🔥'
                          : lead.temperature === 'warm'
                          ? '☀️'
                          : '❄️'}
                      </span>
                    </div>

                    {lead.pain_point && (
                      <div className="kanban-card-pain">
                        {lead.pain_point}
                      </div>
                    )}

                    <div className="kanban-card-footer">
                      <span className="kanban-card-source">
                        {lead.source === 'linkedin_apify'
                          ? '🔗 Apify'
                          : '✋ Manual'}
                      </span>
                      <span
                        className="badge"
                        style={{
                          background: 'rgba(99,102,241,0.1)',
                          color: '#818cf8',
                          fontSize: '10px',
                        }}
                      >
                        {lead.category}
                      </span>
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div
                    style={{
                      padding: '24px 16px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      fontStyle: 'italic',
                    }}
                  >
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
