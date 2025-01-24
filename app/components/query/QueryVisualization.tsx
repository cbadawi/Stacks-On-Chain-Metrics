import React, { useState } from 'react';

import { VariableType } from '../helpers';
import QueryButtons from './QueryButtons';
import { ChartType, CustomizableChartTypes, LeftRight } from '@prisma/client';
import ChartContainer from '../charts/ChartContainer';
import { QueryWithTooltips } from '@/app/query/QueryWithTooltips';
import { seperatePromptFromSql } from '@/app/query/seperatePromptFromSql';

interface QueryVisualizationProps {
  data: any[];
  query: string;
  error: string;
  variableDefaults: VariableType[];
  queryExplanations:
    | {
        section: string;
        explanation: string;
      }[]
    | null
    | undefined;
  handleExplainQuery: () => Promise<void>;
  setQueryExplanations: React.Dispatch<
    React.SetStateAction<
      | {
          section: string;
          explanation: string;
        }[]
      | null
      | undefined
    >
  >;
  // chartColumnsTypes: CustomizableChartTypes[];
  // setChartColumnsTypes: React.Dispatch<
  //   React.SetStateAction<CustomizableChartTypes[]>
  // >;
  // chartAxesTypes: LeftRight[];
  // setChartAxesTypes: React.Dispatch<React.SetStateAction<LeftRight[]>>;
  errorHandler?: (msg: string) => void;
}

const QueryVisualization = ({
  data,
  error,
  query,
  variableDefaults,
  queryExplanations,
  handleExplainQuery,
  setQueryExplanations,
  errorHandler,
}: QueryVisualizationProps) => {
  const [chartType, setChartType] = useState<ChartType>(ChartType.TABLE);

  const { prompt, sql } = seperatePromptFromSql(query);
  return (
    <div className='visualization-container relative flex h-auto min-h-[500px] flex-col shadow-md'>
      <div className='flex justify-center'>
        <QueryButtons
          setChart={setChartType}
          chartType={chartType}
          handleExplainQuery={handleExplainQuery}
          setQueryExplanations={setQueryExplanations}
          query={query}
          errorHandler={errorHandler}
          variableDefaults={variableDefaults}
        />
      </div>
      <div className='mt-5 flex flex-grow items-center justify-center'>
        <ChartContainer
          height={chartType === 'PIE' ? 300 : 600}
          data={data}
          chartType={chartType}
          errorHandler={errorHandler}
        />
      </div>
    </div>
  );
};

export default QueryVisualization;
