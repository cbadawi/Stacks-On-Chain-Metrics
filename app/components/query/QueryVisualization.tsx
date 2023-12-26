import React, { useState } from 'react';

import ChartContainer from '../charts/ChartContainer';
import { CustomizableChartOptions, LeftRight, VariableType } from '../helpers';
import CustomizeBarChart from './CustomizeBarChart';
import QueryButtons from './QueryButtons';
import { ChartType } from '@prisma/client';

interface QueryVisualizationProps {
  data: any[];
  query: string;
  variableDefaults: VariableType[];
  customizableColumnsTypes: CustomizableChartOptions[];
  setCustomizableColumnsTypes: React.Dispatch<
    React.SetStateAction<CustomizableChartOptions[]>
  >;
  customizableAxesTypes: LeftRight[];
  setCustomizableAxesTypes: React.Dispatch<React.SetStateAction<LeftRight[]>>;
  errorHandler?: (msg: string) => void;
}

const QueryVisualization = ({
  data,
  query,
  variableDefaults,
  customizableColumnsTypes,
  setCustomizableColumnsTypes,
  customizableAxesTypes,
  setCustomizableAxesTypes,
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
      />
      {chartType == ChartType.BAR && (
        <CustomizeBarChart
          columnNames={Object.keys(data[0]).slice(1)}
          customizableColumnTypes={customizableColumnsTypes}
          setCustomizableColumnsTypes={setCustomizableColumnsTypes}
          customizableAxesTypes={customizableAxesTypes}
          setCustomizableAxesTypes={setCustomizableAxesTypes}
        />
      )}
      <ChartContainer
        data={data}
        chartType={chartType}
        height={700}
        width={900}
        customizableColumnsTypes={customizableColumnsTypes}
        customizableAxesTypes={customizableAxesTypes}
        errorHandler={errorHandler}
      />
    </div>
  );
};

export default QueryVisualization;
