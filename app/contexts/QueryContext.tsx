'use client';

import { DEFAULT_QUERY } from '@/lib/utils';
import React, { createContext, useContext, useState } from 'react';

export type QueryContextParams = {
  query: string;
  dashboardId: number | null;
  chartId: number | null;
  chartType: string;
  chartTitle: string;
  updateMode: boolean;
};

type QueryContextType = QueryContextParams & {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setDashboardId: React.Dispatch<React.SetStateAction<number | null>>;
  setChartId: React.Dispatch<React.SetStateAction<number | null>>;
  setChartType: React.Dispatch<React.SetStateAction<string>>;
  setChartTitle: React.Dispatch<React.SetStateAction<string>>;
  setUpdateMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [dashboardId, setDashboardId] = useState<number | null>(null);
  const [chartId, setChartId] = useState<number | null>(null);
  const [chartType, setChartType] = useState('');
  const [chartTitle, setChartTitle] = useState('');
  const [updateMode, setUpdateMode] = useState(false);

  return (
    <QueryContext.Provider
      value={{
        query,
        setQuery,
        dashboardId,
        setDashboardId,
        chartId,
        setChartId,
        chartType,
        setChartType,
        chartTitle,
        setChartTitle,
        updateMode,
        setUpdateMode,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
}

export function useQuery() {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error('useQuery must be used within a QueryProvider');
  }
  return context;
}
