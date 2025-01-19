import React, { useState } from 'react';

import { VariableType } from '../helpers';
import QueryButtons from './QueryButtons';
import { ChartType, CustomizableChartTypes, LeftRight } from '@prisma/client';
import CardContainer from '../charts/CardContainer';

interface QueryVisualizationProps {
  data: any[];
  query: string;
  error: string;
  variableDefaults: VariableType[];
  chartColumnsTypes: CustomizableChartTypes[];
  setChartColumnsTypes: React.Dispatch<
    React.SetStateAction<CustomizableChartTypes[]>
  >;
  chartAxesTypes: LeftRight[];
  setChartAxesTypes: React.Dispatch<React.SetStateAction<LeftRight[]>>;
  errorHandler?: (msg: string) => void;
}

const QueryVisualization = ({
  data,
  error,
  query,
  variableDefaults,
  chartColumnsTypes,
  chartAxesTypes,
  errorHandler,
}: QueryVisualizationProps) => {
  const [chartType, setChartType] = useState<ChartType>(ChartType.TABLE);

  // Need to show QueryButtons even if there are errors since the error can be set using invalid chart choice.
  // if (error) return;
  return (
    <div className='visualization-container relative flex h-auto flex-col items-center justify-center shadow-md'>
      <QueryButtons
        setChart={setChartType}
        chartType={chartType}
        query={query}
        errorHandler={errorHandler}
        variableDefaults={variableDefaults}
        chartAxesTypes={chartAxesTypes}
        chartColumnsTypes={chartColumnsTypes}
      />
      <CardContainer
        data={data}
        chartType={chartType}
        errorHandler={errorHandler}
      />
    </div>
  );
};

export default QueryVisualization;
