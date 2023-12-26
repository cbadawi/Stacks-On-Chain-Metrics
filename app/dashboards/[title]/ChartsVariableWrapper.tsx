'use client';

import ResizableChart from '@/app/components/dashboards/ResizableChart';
import Variable from '@/app/components/query/Variable';
import { DashboardWithCharts } from '@/app/lib/db/dashboards/dashboard';
import React, { useState } from 'react';
import RunButton from './RunButton';
import { VariableType } from '@/app/components/helpers';

const getDefaultVariableValues = (dashboard: DashboardWithCharts) => {
  const vars = dashboard.charts
    .map((chart) => chart.variables)
    .flat() as VariableType[];

  const uniqueVariables = Array.from(
    new Set(vars.map((obj) => obj.variable))
  ).map((name) => {
    return vars.find((obj) => obj.variable === name);
  });

  return uniqueVariables;
};

const ChartsVariableWrapper = ({
  dashboard,
  variablesFormId,
}: {
  dashboard: DashboardWithCharts;
  variablesFormId: string;
}) => {
  const [variableValues, setVariableValues] = useState<VariableType[]>([]);
  const defaultVariableValues = getDefaultVariableValues(dashboard);

  return (
    <div className='draggables-variable-wrapper relative h-[100vh] w-full'>
      {!!defaultVariableValues?.length && (
        <form
          id={variablesFormId}
          className='variable-wrapper flex justify-between gap-4 pb-8'
        >
          <div
            className=' grid  max-w-[90%] gap-4'
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
            }}
          >
            {defaultVariableValues.map(
              (variableObject, index) =>
                variableObject && (
                  <Variable
                    key={'variable-wrapper-' + index}
                    defaultValue={variableObject.value.toString()}
                    variable={variableObject.variable}
                  />
                )
            )}
          </div>
          <div className='pt-2'>
            <RunButton
              formId={variablesFormId}
              setVariables={setVariableValues}
            />
          </div>
        </form>
      )}
      <div className='draggables-wrapper h-full border-2 border-solid border-red-900 '>
        {dashboard.charts.map((chart, index) => (
          <ResizableChart
            variables={variableValues}
            key={'chart-' + index}
            chart={chart}
            allCharts={dashboard.charts}
          />
        ))}
      </div>
    </div>
  );
};

export default ChartsVariableWrapper;
