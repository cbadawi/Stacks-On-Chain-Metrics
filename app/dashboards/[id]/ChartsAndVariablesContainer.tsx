'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Variable from '@/app/components/query/Variable';
import DashboardChartsCanvas from './DashboardChartsCanvas';
import RunButton from './RunButton';
import { DashboardWithCharts, VariableType } from '@/app/components/helpers';
import type { Chart, Dashboard } from '@prisma/client';

const getDefaultVariableValues = (
  dashboard: DashboardWithCharts
): VariableType => {
  const vars = dashboard.charts?.map((chart) => chart.variables);
  if (!vars || !vars.length) return {};

  const defaultVariables: VariableType = {};
  vars.map((obj) => {
    const variableObj = obj as VariableType;
    Object.keys(variableObj).map((key) => {
      const value = variableObj[key];
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

  // State for form inputs
  const [formValues, setFormValues] = useState<VariableType>(
    defaultVariableValues
  );
  // Separate state for submitted values that will be passed to charts
  const [submittedValues, setSubmittedValues] = useState<VariableType>(
    defaultVariableValues
  );

  const isFormValid = formValues
    ? Object.values(formValues).every((val) => val && val.trim() !== '')
    : false;

  const handleInputChange =
    (variable: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [variable]: e.target.value }));
    };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    // Only update submitted values when form is submitted
    setSubmittedValues(formValues);
  };

  return (
    <div className='draggables-variable-wrapper relative flex-grow'>
      {variableKeys.length > 0 && (
        <form
          id={variablesFormId}
          onSubmit={handleFormSubmit}
          className='variable-wrapper flex justify-between gap-4 pb-8'
        >
          <div className='flex flex-row flex-wrap gap-4'>
            {variableKeys.map((key, index) => (
              <Variable
                key={`variable-wrapper-${key}-${index}`}
                variable={key}
                value={formValues[key]}
                onChange={handleInputChange(key)}
              />
            ))}
          </div>
          <div className='py-2'>
            <RunButton formId={variablesFormId} disabled={!isFormValid} />
          </div>
        </form>
      )}

      <div className='w-full'>
        <DashboardChartsCanvas
          dashboardId={dashboard.id}
          owner={dashboard.owner.address}
          charts={dashboard.charts as Chart[]}
          variableValues={submittedValues}
        />
      </div>
    </div>
  );
};

export default ChartsAndVariablesContainer;
