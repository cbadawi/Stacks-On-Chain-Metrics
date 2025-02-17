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
import { useUser } from '@/app/contexts/UserProvider';

type ResizableChartProps = {
  dashboardId: number;
  owner: string;
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
  owner,
  width,
  height,
}: ResizableChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useUser();

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
      if (response.message) {
        setError(response.message);
      } else {
        setChartData(response.data ?? []);
      }
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

          <DialogContent className='dialog-content max-h-[80%] sm:max-w-4xl'>
            <DialogHeader>
              <DialogTitle>{chart.title}</DialogTitle>
            </DialogHeader>

            <div className=' flex flex-col'>
              <div className='max-h-[45%] min-w-[400px] overflow-y-auto'>
                <SyntaxHighlighter language='sql' style={dracula}>
                  {chart.query}
                </SyntaxHighlighter>
              </div>

              {owner === userData?.profile.stxAddress.mainnet && (
                <div className='my-5 flex items-center justify-between'>
                  <Button
                    variant='outline'
                    disabled={true}
                    aria-disabled={true}
                  >
                    Edit Chart
                  </Button>
                  <DialogClose asChild>
                    <Button
                      variant='destructive'
                      onClick={async () =>
                        await deleteChart({
                          id: chart.id,
                          dashboardId,
                          owner,
                          appKey: userData?.appPrivateKey,
                        })
                      }
                    >
                      Delete Chart
                    </Button>
                  </DialogClose>
                </div>
              )}
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
