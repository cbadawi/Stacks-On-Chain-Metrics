import React, { useState } from 'react';
import { BsTable } from 'react-icons/bs';
import {
  FcAreaChart,
  FcLineChart,
  FcBarChart,
  FcPieChart,
  FcFrame,
} from 'react-icons/fc';
import { BiSolidBellRing } from 'react-icons/bi';

import ChartContainer from '../charts/ChartContainer';
import { FiSave, FiDownload } from 'react-icons/fi';
import { MdOutlineNumbers } from 'react-icons/md';
import { ChartType, CustomizableChartOptions } from '../charts/helpers';
import CustomizeBarChart from './CustomizeBarChart';
import StarterPlaceholderMessage from './StarterPlaceholderMessage';

interface QueryVisualizationProps {
  data: any[];
  customizableColumnsTypes: CustomizableChartOptions[];
  setCustomizableColumnsTypes: React.Dispatch<
    React.SetStateAction<CustomizableChartOptions[]>
  >;
}

const QueryVisualization = ({
  data,
  customizableColumnsTypes,
  setCustomizableColumnsTypes,
}: QueryVisualizationProps) => {
  // Note: the diff of linechart vs barchart is that line chart has a brush and only lines
  // whereas the barchart will have a combination of lines and chart but no brush
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
      {!!data?.length && (
        <div className='icons-flex-container relative m-0 flex min-h-[4rem] flex-row items-center justify-between gap-2 pl-12 pr-12'>
          <div className='tooltip tooltip-primary' data-tip='Save to Dashboard'>
            <div className='btn hover:relative hover:bottom-1 hover:overflow-visible'>
              <FiSave />
            </div>
          </div>
          <div className='tooltip tooltip-primary' data-tip='Download to CSV'>
            <div className='btn hover:relative hover:bottom-1 hover:overflow-visible'>
              <FiDownload />
            </div>
          </div>
          <div className='tooltip tooltip-primary' data-tip='Create Alerts'>
            <div className='btn hover:relative hover:bottom-1 hover:overflow-visible'>
              <BiSolidBellRing />
            </div>
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
      )}
      {!!data?.length && chart == ChartType.bar && (
        <CustomizeBarChart
          columnNames={Object.keys(data[0]).slice(1)}
          customizableColumnTypes={customizableColumnsTypes}
          setCustomizableColumnsTypes={setCustomizableColumnsTypes}
        />
      )}
      {!!data?.length && (
        <ChartContainer
          data={data}
          chartType={chart}
          height={700}
          width={900}
          customizableColumnsTypes={customizableColumnsTypes}
        />
      )}
      {!data?.length && <StarterPlaceholderMessage />}
      <span>{JSON.stringify(data, null, 2)}</span>
    </div>
  );
};

export default QueryVisualization;
