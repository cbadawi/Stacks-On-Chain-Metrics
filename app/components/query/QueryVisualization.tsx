import React, { useState } from 'react';

import ChartContainer from '../charts/ChartContainer';
import {
  CHART_CONTAINER_HEIGHT,
  CHART_CONTAINER_WIDTH,
  VariableType,
} from '../helpers';
import CustomizeBarChart from './CustomizeBarChart';
import QueryButtons from './QueryButtons';
import { ChartType, CustomizableChartTypes, LeftRight } from '@prisma/client';

interface QueryVisualizationProps {
  data: any[];
  query: string;
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
  query,
  variableDefaults,
  chartColumnsTypes,
  setChartColumnsTypes,
  chartAxesTypes,
  setChartAxesTypes,
  errorHandler,
}: QueryVisualizationProps) => {
  // Note: the diff of linechart vs barchart is that line chart has a brush and only lines
  // whereas the barchart will have a combination of lines and chart but no brush
  const [chartType, setChartType] = useState<ChartType>(ChartType.TABLE);

  return (
    <div className='visualization-container relative flex  flex-col justify-center'>
      <QueryButtons
        setChart={setChartType}
        chartType={chartType}
        query={query}
        errorHandler={errorHandler}
        variableDefaults={variableDefaults}
        chartAxesTypes={chartAxesTypes}
        chartColumnsTypes={chartColumnsTypes}
      />
      {chartType == ChartType.BAR && (
        <CustomizeBarChart
          columnNames={Object.keys(data[0]).slice(1)}
          chartColumnTypes={chartColumnsTypes}
          setChartColumnsTypes={setChartColumnsTypes}
          chartAxesTypes={chartAxesTypes}
          setChartAxesTypes={setChartAxesTypes}
        />
      )}
      <ChartContainer
        data={data}
        chartType={chartType}
        height={CHART_CONTAINER_HEIGHT}
        width={CHART_CONTAINER_WIDTH}
        chartColumnsTypes={chartColumnsTypes}
        chartAxesTypes={chartAxesTypes}
        errorHandler={errorHandler}
      />
    </div>
  );
};

export default QueryVisualization;
