'use client';

import { Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import QueryErrorContainer from '../QueryErrorContainer';
import LoadingSkeleton from '@/app/dashboards/loading';
import ChartContainer from '../charts/ChartContainer';
import { Chart } from '@prisma/client';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteChart } from '@/app/lib/db/dashboards/charts';
import { replaceVariables } from '@/app/lib/variables';
import { fetchData } from '@/app/lib/ai/query';

type ResizableChartProps = {
  dashboardId: number;
  chart: Chart;
  variables: Record<string, string>;
  editMode: boolean;
  width: number; // New: dynamic width (in pixels)
  height: number; // New: dynamic height (in pixels)
};

const ResizableChart = ({
  chart,
  dashboardId,
  variables,
  editMode,
  width,
  height,
}: ResizableChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchChartData(chart, variables);
  }, [chart.variables ? variables : null]);

  const fetchChartData = async (
    chart: Chart,
    variables: Record<string, string>
  ) => {
    setError('');
    setIsLoading(true);
    console.log('fetchChartData', { chart, variables });
    try {
      const queryWithVariables = replaceVariables(chart.query, variables);
      const response = await fetchData(queryWithVariables);
      setChartData(response);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <CardHeader className='card-header flex flex-row items-center justify-between px-8 py-2 pt-4'>
        <CardTitle className='card-title text-lg font-normal'>
          {chart.title}
        </CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Info
              size={16}
              // color='rgb(255,255,255, 0.7)'
              className='chartinfo hover:cursor-pointer'
            />
          </DialogTrigger>

          <DialogContent className='dialog-content sm:max-w-4xl'>
            <DialogHeader>
              <DialogTitle>{chart.title}</DialogTitle>
            </DialogHeader>

            <div
              key={'chart-info-' + chart.title}
              className='my-4 overflow-x-auto'
            >
              <div className='min-w-[900px]'>
                <SyntaxHighlighter language='sql' style={dracula}>
                  {chart.query}
                </SyntaxHighlighter>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <Button variant='outline' aria-disabled={true} disabled={true}>
                Edit Chart
              </Button>
              <DialogClose asChild>
                <Button
                  variant='destructive'
                  disabled={true}
                  aria-disabled={true}
                  onClick={() => deleteChart({ id: chart.id, dashboardId })}
                >
                  Delete Chart
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      {error && <QueryErrorContainer error={error} setError={setError} />}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        chartData?.length > 0 && (
          <ChartContainer
            key={chart.id}
            data={chartData}
            chartType={chart.type}
            // Use dynamic dimensions provided via props
            height={height}
            width={width}
          />
        )
      )}
    </>
  );
};

export default ResizableChart;
