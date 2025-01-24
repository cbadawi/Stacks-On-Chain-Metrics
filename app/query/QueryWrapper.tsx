'use client';

import React, { useState } from 'react';
import SqlEditor from '../components/SqlEditor';
import QueryErrorContainer from '../components/QueryErrorContainer';
// import QueryVisualization from '../components/query/QueryVisualization';
import StarterPlaceholderMessage from '../components/query/StarterPlaceholderMessage';
import { VariableType, replaceVariable } from '../components/helpers';
import { CustomizableChartTypes, LeftRight } from '@prisma/client';
import QueryVisualization from '../components/query/QueryVisualization';
import { explainQuery, fetchData, generateQuery } from './actions';
import { Card } from '@/components/ui/card';
import Spinner from '../components/Spinner';
import { QueryExplanation } from '../lib/types';
import { seperatePromptFromSql } from './seperatePromptFromSql';
import { findIsAIPrompt } from './isAIPrompt';

const DEFAULT_QUERY = `-- PostgreSQL 15
-- Press Ctrl+Enter to run
-- You can use variables by wrapping words in double brackets {{}}
select * from stacks_blockchain_api.blocks limit 1;`;
// TODO change default query to something more recent

const QueryWrapper = () => {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // array containing the type of column. ex ['bar', 'bar', 'line']
  // const [chartColumnsTypes, setChartColumnsTypes] = useState<
  //   CustomizableChartTypes[]
  // >([]);
  // array containing the position of axis.
  // const [chartAxesTypes, setChartAxesTypes] = useState<LeftRight[]>([]);
  const [data, setData] = useState<any[] | undefined | never[]>([]);
  const [variableDefaults, setVariableDefaults] = useState<VariableType[]>([]);
  const [queryExplanations, setQueryExplanations] = useState<
    QueryExplanation[] | null
  >();

  const replaceVariables = (
    query: string,
    errorHandler?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const inputElements = document.getElementsByClassName('variable-input');
    const variablesList: VariableType[] = [];
    const res = Array.from(inputElements).every((element) => {
      const variable = element.className.split(' ')[1];
      const value = (element as HTMLButtonElement).value;
      if (!value) {
        errorHandler && errorHandler(`Variable "${variable}" not set.`);
        return false;
      }
      query = replaceVariable(query, variable, value);
      variablesList.push({ variable, value });
      return true;
    });
    setVariableDefaults(variablesList);
    return res ? query : '';
  };

  const runQuery = async (query: string) => {
    setIsLoading(true);
    setData([]);
    setVariableDefaults([]);
    setError('');
    const queryWithVariables = replaceVariables(query, setError);

    if (queryWithVariables) {
      const isAiPrompt = findIsAIPrompt(queryWithVariables);
      const finalQuery = isAiPrompt
        ? await generateQuery(queryWithVariables)
        : queryWithVariables;

      if (isAiPrompt) {
        const { prompt } = seperatePromptFromSql(query);
        setQuery('-- ' + prompt + '\n' + finalQuery);
      }
      try {
        const response = await fetchData(finalQuery);
        setData(response);
        setQueryExplanations(null);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      }
      setIsLoading(false);
    }
  };

  const handleExplainQuery = async () => {
    setQueryExplanations(null);
    setIsLoading(true);
    const { prompt, sql } = seperatePromptFromSql(query);
    const { explanations } = await explainQuery(prompt, query);
    console.log({ explanations });
    setQueryExplanations(explanations);
    setIsLoading(false);
  };

  return (
    <div className='query-wrapper'>
      <div className='editor-wrapper relative mx-auto mb-4 mt-10 flex w-[95%] items-center justify-center'>
        <SqlEditor
          query={query}
          setQuery={setQuery}
          setError={setError}
          isLoading={isLoading}
          runQuery={runQuery}
        />
      </div>
      <>{JSON.stringify({ data })}</>
      <div>
        {error && <QueryErrorContainer error={error} setError={setError} />}
        {isLoading && <Spinner />}
        <Card className='relative my-12 h-auto rounded-t-3xl  px-0 py-4 '>
          {!data?.length ? (
            <StarterPlaceholderMessage />
          ) : (
            <QueryVisualization
              data={data}
              query={query}
              errorHandler={setError}
              queryExplanations={queryExplanations}
              handleExplainQuery={handleExplainQuery}
              setQueryExplanations={setQueryExplanations}
              error={error}
              variableDefaults={variableDefaults}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default QueryWrapper;
