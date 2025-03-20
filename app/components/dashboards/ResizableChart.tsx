'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@/app/contexts/UserProvider';
import { replaceVariables } from '@/app/lib/variables';
import { fetchData } from '@/app/lib/ai/fetchData';
import ChartHeader from './ChartHeader';
import ChartContent from './ChartContent';
import { ChartType } from '../helpers';
import type { Chart, Dashboard } from '@prisma/client';

type ResizableChartProps = {
  dashboardId: number;
  owner: string;
  chart: Chart;
  variables: Record<string, string>;
  editMode: boolean;
  width: number;
  height: number;
};

const ResizableChart = ({
  chart,
  dashboardId,
  variables,
  editMode,
  owner,
  width,
  height,
}: ResizableChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useUser();
  const isOwner = owner === userData?.profile.stxAddress.mainnet;

  useEffect(() => {
    fetchChartData(chart, variables);
  }, [chart.variables ? variables : null]);

  const fetchChartData = async (
    chart: Chart,
    variables: Record<string, string>
  ) => {
    setError('');
    setIsLoading(true);
    try {
      const queryWithVariables = replaceVariables(chart.query, variables);
      const data = await fetchData(queryWithVariables);
      if (!data) {
        setError('No response from server');
      } else if (data.message && !data.success) {
        setError(data.message);
      } else {
        setChartData(data?.response?.data ?? []);
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <ChartHeader
        chart={chart}
        dashboardId={dashboardId}
        owner={owner}
        isOwner={isOwner}
      />
      <ChartContent
        error={error}
        setError={setError}
        isLoading={isLoading}
        chartData={chartData}
        chartType={chart.type as ChartType}
        chartId={chart.id}
        width={width}
        height={height}
      />
    </>
  );
};

export default ResizableChart;
