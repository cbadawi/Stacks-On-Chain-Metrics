'use client';

import React, { useState } from 'react';
import { addChartToDashboard } from './actions';
import { ChartType, CustomizableChartTypes, LeftRight } from '@prisma/client';
import { VariableType } from '../helpers';

type SaveToDashboardProps = {
  dashboardTitles: string[];
  chartType: ChartType;
  query: string;
  closeModal: () => void;
  variableDefaults?: VariableType[];
  chartColumnsTypes: CustomizableChartTypes[];
  chartAxesTypes: LeftRight[];
};

const SaveToExistingDashboardForm = ({
  dashboardTitles,
  chartType,
  closeModal,
  query,
  variableDefaults,
  chartColumnsTypes,
  chartAxesTypes,
}: SaveToDashboardProps) => {
  const [dashboardSelector, setDashboardSelector] = useState<string>();
  console.log('input query ', query);
  return (
    <form
      action={async (f) => {
        const response = await addChartToDashboard(f);
        if (response?.chart) closeModal();
      }}
      autoComplete='off'
      className='flex flex-col items-center justify-center'
    >
      <div className='card w-96 bg-neutral text-neutral-content'>
        <div className='card-body items-center p-5 text-center'>
          <h2 className='card-title'>Dashboards:</h2>
          <div className='dashboards max-h-[8rem] w-64 overflow-y-scroll rounded border-[1px] border-gray-500'>
            {dashboardTitles.map((title, index) => {
              let className =
                'flex min-h-[1.75rem] items-center justify-center cursor-pointer hover:bg-gray-600';
              if (dashboardSelector === title) className += ' bg-gray-600';
              return (
                <div
                  key={'link-' + index}
                  className={className}
                  onClick={() => {
                    setDashboardSelector(title);
                  }}
                >
                  {title}
                </div>
              );
            })}
          </div>
          <input
            required
            name='chartTitle'
            placeholder='Chart Title'
            type='title'
            className='input input-bordered mb-3 w-full'
          />
          <input
            hidden
            required
            name='title'
            defaultValue={dashboardSelector}
            readOnly
          />
          {/* defaultValue={chartType} insteaf of value returns always TABLE. remove the hidden to check with defaultValue */}
          <input value={chartType} name='chartType' readOnly hidden />
          <input
            defaultValue={chartAxesTypes}
            name='chartAxesTypes'
            hidden
            readOnly
          />
          <input
            defaultValue={chartColumnsTypes}
            name='chartColumnsTypes'
            hidden
            readOnly
          />
          <input defaultValue={query} name='query' hidden readOnly />
          <input
            defaultValue={JSON.stringify(variableDefaults)}
            name='variables'
            hidden
            readOnly
          />
          <div className='card-actions justify-end'>
            <button className='btn btn-primary'>Save Chart</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SaveToExistingDashboardForm;
