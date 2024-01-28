import React, { useState } from 'react';
import { BiSolidBellRing } from 'react-icons/bi';
import { BsTable } from 'react-icons/bs';
import { FcBarChart, FcLineChart, FcPieChart } from 'react-icons/fc';
import { FiDownload, FiSave } from 'react-icons/fi';
import { MdOutlineNumbers } from 'react-icons/md';
import SaveToDashBtn from './SaveToDashBtn';
import SaveToDashboardForm from './SaveToDashboardForm';
import { ChartType, CustomizableChartTypes, LeftRight } from '@prisma/client';
import { VariableType } from '../helpers';

const chartIcons = [
  <BsTable color='#6543FC' size={20} key={ChartType.TABLE} />,
  <FcLineChart size={25} key={ChartType.LINE} />,
  <FcPieChart size={25} key={ChartType.PIE} />,
  <FcBarChart size={25} key={ChartType.BAR} />,
  // <FcFrame size={20} key={ChartType.TREEMAP} />,
  <MdOutlineNumbers color='#6543FC' size={25} key={ChartType.NUMBER} />,
];

type QueryButtonsProps = {
  chartType: ChartType;
  query: string;
  setChart: React.Dispatch<React.SetStateAction<ChartType>>;
  errorHandler?: (msg: string) => void;
  variableDefaults: VariableType[];
  chartColumnsTypes: CustomizableChartTypes[];
  chartAxesTypes: LeftRight[];
};

const QueryButtons = ({
  setChart,
  chartType,
  query,
  errorHandler,
  chartColumnsTypes,
  chartAxesTypes,
  variableDefaults,
}: QueryButtonsProps) => {
  // needed to trigger the use effect hook in the form & fetch dashboards
  let [saveToDashCounter, setSaveToDashCounter] = useState(0);
  return (
    <div className='icons-flex-container relative m-0 flex min-h-[4rem] flex-row items-center justify-between gap-2 pl-12 pr-12'>
      <div className='flex items-center justify-center gap-2'>
        <div className='tooltip tooltip-primary' data-tip='Save to Dashboard'>
          <SaveToDashBtn
            saveToDashCounter={saveToDashCounter}
            setSaveToDashCounter={setSaveToDashCounter}
            OpenButtonChilden={<FiSave color='#6543FC' size={20} />}
            query={query}
            variableDefaults={variableDefaults}
            chartType={chartType}
            chartAxesTypes={chartAxesTypes}
            chartColumnsTypes={chartColumnsTypes}
          />
        </div>
        <div className='tooltip tooltip-primary' data-tip='Download to CSV'>
          <div className='btn hover:relative hover:bottom-1 hover:overflow-visible'>
            <FiDownload color='#6543FC' size={20} />
          </div>
        </div>
        <div
          className='tooltip tooltip-primary hidden'
          data-tip='Create Alerts (SOON)'
        >
          <div className='btn hover:relative hover:bottom-1 hover:overflow-visible'>
            <BiSolidBellRing />
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center gap-2'>
        {chartIcons.map((icon, index) => {
          return (
            <div
              className='chart-icons-container flex h-16 flex-row items-center gap-2 overflow-x-auto'
              key={index}
              onClick={() => {
                setChart(icon.key! as unknown as ChartType);
                if (errorHandler) errorHandler('');
              }}
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
    </div>
  );
};

export default QueryButtons;
