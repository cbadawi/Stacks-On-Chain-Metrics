import React, { useState } from 'react';
import {
  Sheet,
  LineChart,
  BarChart,
  PieChart,
  Hash,
  Bell,
  Download,
  Sparkles,
} from 'lucide-react';
import SaveToDashBtn from './SaveToDashBtn';
import { ChartType } from '../helpers';
import { VariableType } from '../helpers';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const chartIcons = [
  {
    icon: <Sheet color='#6543FC' size={20} />,
    tooltip: 'Table',
    key: ChartType.TABLE,
  },
  {
    icon: <LineChart color='#6543FC' size={25} />,
    tooltip: 'Line Chart',
    key: ChartType.LINE,
  },
  {
    icon: <BarChart color='#6543FC' size={25} />,
    tooltip: 'Bar Chart',
    key: ChartType.BAR,
  },
  {
    icon: <PieChart color='#6543FC' size={25} />,
    tooltip: 'Pie Chart',
    key: ChartType.PIE,
  },
  {
    icon: <Hash color='#6543FC' size={25} />,
    tooltip: 'Stats',
    key: ChartType.NUMBER,
  },
];

type QueryButtonsProps = {
  chartType: ChartType;
  query: string;
  setChart: React.Dispatch<React.SetStateAction<ChartType>>;
  errorHandler?: (msg: string) => void;
  variableDefaults: VariableType;
  handleExplainQuery: () => Promise<void>;
  setQueryExplanations: React.Dispatch<
    React.SetStateAction<
      | {
          section: string;
          explanation: string;
        }[]
      | null
    >
  >;
  // chartColumnsTypes: CustomizableChartTypes[];
  // chartAxesTypes: LeftRight[];
};

const QueryButtons = ({
  setChart,
  chartType,
  query,
  errorHandler,
  handleExplainQuery,
  setQueryExplanations,
  variableDefaults,
}: QueryButtonsProps) => {
  return (
    <div className='icons-flex-container relative flex w-full flex-row items-center justify-between gap-4 rounded-md px-12 pt-0 shadow-sm'>
      <TooltipProvider>
        <div className='flex items-center gap-3'>
          {/* Save to Dashboard */}
          <Tooltip>
            <TooltipTrigger asChild>
              <SaveToDashBtn
                query={query}
                variableDefaults={variableDefaults}
                chartType={chartType}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Save to Dashboard</p>
            </TooltipContent>
          </Tooltip>

          {/* AI Explain */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={'lg'}
                className='btn hover:relative hover:bottom-1 hover:overflow-visible'
                variant='secondary'
                onClick={() => {
                  handleExplainQuery();
                  if (errorHandler) errorHandler('');
                }}
              >
                <Sparkles color='#6543FC' size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>AI Optimize & Explain</p>
            </TooltipContent>
          </Tooltip>

          {/* Download */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='hover:cursor-not-allowed'>
                <Button size={'lg'} variant='outline' disabled>
                  <Download size={20} className='hover:cursor-not-allowed' />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
            </TooltipContent>
          </Tooltip>

          {/* Alerts (SOON) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='hover:cursor-not-allowed'>
                <Button size={'lg'} variant='outline' disabled>
                  <Bell />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create Alerts (SOON)</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Chart Icon Buttons */}
        <div className='flex h-16 items-center gap-2 overflow-x-auto'>
          {chartIcons.map((iconData, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className='chart-icons-container flex flex-row items-center gap-2'
                  onClick={() => {
                    setChart(iconData.key as ChartType);
                    setQueryExplanations(null);
                    if (errorHandler) errorHandler('');
                  }}
                >
                  <Button
                    size={'lg'}
                    variant='secondary'
                    className='btn hover:relative hover:bottom-1 hover:overflow-visible'
                  >
                    {iconData.icon}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{iconData.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};

export default QueryButtons;
