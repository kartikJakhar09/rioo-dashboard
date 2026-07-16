'use client';

import { createContext, useContext, useReducer, useCallback } from 'react';
import { dummyLeads } from '@/data/dummyData';

const LeadContext = createContext(null);

function leadReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_STAGE': {
      return state.map((lead) =>
        lead.id === action.payload.id
          ? { ...lead, stage: action.payload.stage }
          : lead
      );
    }
    case 'UPDATE_STATUS': {
      return state.map((lead) =>
        lead.id === action.payload.id
          ? { ...lead, status: action.payload.status }
          : lead
      );
    }
    case 'UPDATE_LEAD': {
      return state.map((lead) =>
        lead.id === action.payload.id
          ? { ...lead, ...action.payload.updates }
          : lead
      );
    }
    default:
      return state;
  }
}

export function LeadProvider({ children }) {
  const [leads, dispatch] = useReducer(leadReducer, dummyLeads);

  const updateStage = useCallback((id, stage) => {
    dispatch({ type: 'UPDATE_STAGE', payload: { id, stage } });
  }, []);

  const updateStatus = useCallback((id, status) => {
    dispatch({ type: 'UPDATE_STATUS', payload: { id, status } });
  }, []);

  const updateLead = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_LEAD', payload: { id, updates } });
  }, []);

  const getLeadById = useCallback(
    (id) => leads.find((lead) => lead.id === id),
    [leads]
  );

  return (
    <LeadContext.Provider
      value={{ leads, updateStage, updateStatus, updateLead, getLeadById }}
    >
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
}
