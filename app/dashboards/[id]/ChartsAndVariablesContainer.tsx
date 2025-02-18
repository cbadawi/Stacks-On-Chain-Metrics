'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Variable from '@/app/components/query/Variable';
import DashboardChartsCanvas from './DashboardChartsCanvas';
import RunButton from './RunButton';
import { DashboardWithCharts } from '@/app/lib/db/dashboards/dashboard';
import { VariableType } from '@/app/components/helpers';
import { isJsonObject } from '@/app/lib/db/isJsonOject';

// Helper to extract default values remains largely the same
const getDefaultVariableValues = (
  dashboard: DashboardWithCharts
): VariableType => {
  const vars = dashboard.charts?.map((chart) => chart.variables);
  if (!vars || !vars.length) return {};
  const defaultVariables: VariableType = {};
  vars.map((obj) => {
    if (isJsonObject(obj))
      Object.keys(obj).map((key) => {
        const value = obj[key];
        if (value) defaultVariables[key] = value.toString();
      });
  });

  return defaultVariables;
};

const ChartsAndVariablesContainer = ({
  dashboard,
  variablesFormId,
}: {
  dashboard: DashboardWithCharts;
  variablesFormId: string;
}) => {
  const defaultVariableValues = getDefaultVariableValues(dashboard);
  const variableKeys = Object.keys(defaultVariableValues || {});

  const [activeValues, setActiveValues] = useState<VariableType>(
    defaultVariableValues
  );

  const isFormValid = defaultVariableValues
    ? Object.values(defaultVariableValues).every(
        (val) => val && val.trim() !== ''
      )
    : false;

  const handleInputChange =
    (variable: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setActiveValues((prev) => ({ ...prev, [variable]: e.target.value }));
    };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    setActiveValues(activeValues);
  };

  return (
    <div className='draggables-variable-wrapper absolute flex-grow overflow-visible'>
      {variableKeys.length > 0 && (
        <form
          id={variablesFormId}
          onSubmit={handleFormSubmit}
          className='variable-wrapper flex justify-between gap-4 pb-8'
        >
          <div
            className='grid max-w-[90%] gap-4'
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
            }}
          >
            {variableKeys.map((key, index) => {
              return (
                <Variable
                  key={`variable-wrapper-${key}-${index}`}
                  variable={key}
                  value={activeValues[key]}
                  onChange={handleInputChange(key)}
                />
              );
            })}
          </div>
          {/* <div className='py-2 pr-8'>
            <RunButton formId={variablesFormId} disabled={!isFormValid} />
          </div> */}
        </form>
      )}
      <DashboardChartsCanvas
        dashboardId={dashboard.id}
        owner={dashboard.owner.address}
        charts={dashboard.charts}
        variableValues={activeValues}
      />
    </div>
  );
};

export default ChartsAndVariablesContainer;
