'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Variable from '@/app/components/query/Variable';
import DashboardChartsCanvas from './DashboardChartsCanvas';
import RunButton from './RunButton';
import { DashboardWithCharts } from '@/app/lib/db/dashboards/dashboard';
import { VariableType } from '@/app/components/helpers';

// Helper to extract default values remains largely the same
const getDefaultVariableValues = (
  dashboard: DashboardWithCharts
): (VariableType | undefined)[] | null => {
  const vars = dashboard.charts
    ?.map((chart) => chart.variables)
    .flat() as VariableType[];
  if (!vars) return null;
  const uniqueVariables = Array.from(
    new Set(vars.map((obj) => obj.variable))
  ).map((name) => {
    return vars.find((obj) => obj.variable === name);
  });
  return uniqueVariables;
};

const ChartsAndVariablesContainer = ({
  dashboard,
  variablesFormId,
}: {
  dashboard: DashboardWithCharts;
  variablesFormId: string;
}) => {
  // Create a state object keyed by variable name for the initial values
  const defaultVariableValues = getDefaultVariableValues(dashboard) || [];
  const initialValues =
    defaultVariableValues.reduce((acc, variable) => {
      if (variable && acc) acc[variable.variable] = variable.value.toString();
      return acc;
    }, {} as VariableType) ?? {};

  const [formValues, setFormValues] = useState<VariableType>(initialValues);
  const [activeVariables, setActiveVariables] =
    useState<VariableType>(initialValues);

  const isFormValid = formValues
    ? Object.values(formValues).every((val) => val && val.trim() !== '')
    : false;

  // Update formValues on input change
  const handleInputChange =
    (variable: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [variable]: e.target.value }));
    };

  // On form submit, update the activeVariables state
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    setActiveVariables(formValues);
    console.log('Running with variables:', formValues);
  };

  return (
    <div className='draggables-variable-wrapper absolute w-full flex-grow overflow-visible'>
      {defaultVariableValues.length > 0 && (
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
            {defaultVariableValues.map((variableObject, index) => {
              if (!variableObject) return null;
              const value = formValues
                ? formValues[variableObject.variable]
                : null;
              return (
                <Variable
                  key={`variable-wrapper-${index}`}
                  variable={variableObject.variable}
                  value={value ?? variableObject.value.toString()}
                  onChange={handleInputChange(variableObject.variable)}
                />
              );
            })}
          </div>
          <div className='py-2 pr-4'>
            <RunButton formId={variablesFormId} disabled={!isFormValid} />
          </div>
        </form>
      )}
      <DashboardChartsCanvas
        dashboardId={dashboard.id}
        charts={dashboard.charts}
        variableValues={activeVariables}
      />
    </div>
  );
};

export default ChartsAndVariablesContainer;
