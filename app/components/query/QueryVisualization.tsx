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

  // Need to show QueryButtons even if there are errors since the error can be set using invalid chart choice.
  // if (error) return;
  return (
    <div className='visualization-container relative flex h-auto flex-col items-center justify-center shadow-md'>
      <QueryButtons
        setChart={setChartType}
        chartType={chartType}
        handleExplainQuery={handleExplainQuery}
        setQueryExplanations={setQueryExplanations}
        query={query}
        errorHandler={errorHandler}
        variableDefaults={variableDefaults}
      />
      {queryExplanations ? (
        <QueryWithTooltips sql={sql} queryExplanations={queryExplanations} />
      ) : (
        <ChartContainer
          data={data}
          chartType={chartType}
          errorHandler={errorHandler}
        />
      )}
    </div>
  );
};

export default QueryVisualization;
