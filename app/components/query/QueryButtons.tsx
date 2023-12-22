import React, { useRef, useState } from 'react';
import { BiSolidBellRing } from 'react-icons/bi';
import { BsTable } from 'react-icons/bs';
import { FcBarChart, FcFrame, FcLineChart, FcPieChart } from 'react-icons/fc';
import { FiDownload, FiSave } from 'react-icons/fi';
import { MdOutlineNumbers } from 'react-icons/md';
import Modal from '../Modal';
import SaveToDashboardForm from './SaveToDashboardForm';
import { ChartType } from '@prisma/client';

const chartIcons = [
  <BsTable size={20} key={ChartType.TABLE} />,
  <FcLineChart size={20} key={ChartType.LINE} />,
  <FcPieChart size={20} key={ChartType.PIE} />,
  <FcBarChart size={20} key={ChartType.BAR} />,
  // <FcFrame size={20} key={ChartType.TREEMAP} />,
  <MdOutlineNumbers size={20} key={ChartType.NUMBER} />,
];

type QueryButtonsProps = {
  chartType: ChartType;
  query: string;
  setChart: React.Dispatch<React.SetStateAction<ChartType>>;
  errorHandler?: (msg: string) => void;
};

const QueryButtons = ({
  setChart,
  chartType,
  query,
  errorHandler,
}: QueryButtonsProps) => {
  // needed to trigger the use effect hook in the form & fetch dashboards
  let [saveToDashCounter, setSaveToDashCounter] = useState(0);
  return (
    <div className='icons-flex-container relative m-0 flex min-h-[4rem] flex-row items-center justify-between gap-2 pl-12 pr-12'>
      <div className='flex items-center justify-center gap-8'>
        <div className='tooltip tooltip-primary' data-tip='Save to Dashboard'>
          <Modal
            saveToDashCounter={saveToDashCounter}
            setSaveToDashCounter={setSaveToDashCounter}
            OpenButtonChilden={<FiSave />}
            ModalChildren={
              <SaveToDashboardForm
                query={query}
                chartType={chartType}
                saveToDashCounter={saveToDashCounter}
              />
            }
          />
        </div>
        <div className='tooltip tooltip-primary' data-tip='Download to CSV'>
          <div className='btn hover:relative hover:bottom-1 hover:overflow-visible'>
            <FiDownload />
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
      <div className='flex items-center justify-center gap-8'>
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
