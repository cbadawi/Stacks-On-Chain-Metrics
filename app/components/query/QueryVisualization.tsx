import React, { useState } from 'react';
import { BsTable } from 'react-icons/bs';
import {
  FcAreaChart,
  FcLineChart,
  FcBarChart,
  FcPieChart,
  FcFrame,
} from 'react-icons/fc';
import ChartContainer from '../charts/ChartContainer';
import { FiSave, FiDownload } from 'react-icons/fi';
import { MdOutlineNumbers } from 'react-icons/md';
import { ChartType } from '../charts/helpers';

interface QueryVisualizationProps {
  data: any;
}

const QueryVisualization = ({ data }: QueryVisualizationProps) => {
  const [chart, setChart] = useState<ChartType>(ChartType.table);

  const chartIcons = [
    <BsTable size={20} key={ChartType.table} />,
    <FcLineChart size={20} key={ChartType.line} />,
    <FcPieChart size={20} key={ChartType.pie} />,
    <FcBarChart size={20} key={ChartType.bar} />,
    <FcFrame size={20} key={ChartType.treemap} />,
    <MdOutlineNumbers size={20} key={ChartType.number} />,
  ];

  return (
    <div className='visualization-container relative my-12 flex w-full flex-col justify-center rounded-t-3xl bg-[#111111] px-5 py-4 md:px-0'>
      <text>{chart}</text>
      <div className='icons-flex-container relative m-0 flex min-h-[4rem] flex-row items-center justify-between gap-2 pl-12 pr-12'>
        <div className='btn hover:relative hover:bottom-1 hover:overflow-visible'>
          <FiSave />
        </div>
        {chartIcons.map((icon, index) => {
          return (
            <div
              className='chart-icons-container flex h-16 flex-row items-center gap-2 overflow-x-auto'
              key={index}
              onClick={() => setChart(icon.key! as unknown as ChartType)}
            >
              <button
                className='btn hover:relative hover:bottom-1 hover:overflow-visible'
                key={index}
              >
                {icon}
              </button>
            </div>
          );
        })}
      </div>
      {data?.length && <ChartContainer data={data} chartType={chart} />}
      <text>{JSON.stringify(data, null, 2)}</text>
    </div>
  );
};

export default QueryVisualization;
