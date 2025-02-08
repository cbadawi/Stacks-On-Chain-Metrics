'use client';

import React, { useState } from 'react';
import SqlEditor from '../components/SqlEditor';
import QueryErrorContainer from '../components/QueryErrorContainer';
// import QueryVisualization from '../components/query/QueryVisualization';
import StarterPlaceholderMessage from '../components/query/StarterPlaceholderMessage';
import {
  VariableType,
  replaceVariable,
  wrapQueryLimit,
} from '../components/helpers';
import QueryVisualization from '../components/query/QueryVisualization';
import { explainQuery, fetchData, generateQuery } from './actions';
import { Card } from '@/components/ui/card';
import Spinner from '../components/Spinner';
import { QueryExplanation } from '../lib/types';
import { seperateCommentsFromSql } from './seperateCommentsFromSql';
import { findIsAIPrompt } from './isAIPrompt';
import { Button } from '@/components/ui/button';
import QueryVariablesForm from '../components/query/QueryVariablesForm';

const DEFAULT_QUERY = `-- To write an AI prompt, start with "-- ai" 
-- followed by your prompt here.

-- Postgresql 15
-- You can use variables by wrapping words in double brackets {{}}
select * from blocks limit 1;`;
// TODO change default query to something more recent

const QueryWrapper = () => {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[] | undefined | never[]>(undefined);
  const [variableDefaults, setVariableDefaults] = useState<VariableType[]>([]);
  const [queryExplanations, setQueryExplanations] = useState<
    QueryExplanation[] | null
  >();

  // array containing the type of column. ex ['bar', 'bar', 'line']
  // const [chartColumnsTypes, setChartColumnsTypes] = useState<
  //   CustomizableChartTypes[]
  // >([]);
  // array containing the position of axis.
  // const [chartAxesTypes, setChartAxesTypes] = useState<LeftRight[]>([]);

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

  const handleClear = () => {
    console.log('CLEARRRRRR');
    setError('');
    setIsLoading(false);
    setQueryExplanations(null);
  };

  const runQuery = async (query: string) => {
    setIsLoading(true);
    setData([]);
    setVariableDefaults([]);
    setError('');
    const queryWithVariables = replaceVariables(query, setError);
    if (queryWithVariables) {
      const isAiPrompt = findIsAIPrompt(queryWithVariables);
      let finalQuery = queryWithVariables;
      if (isAiPrompt) {
        const aiquery = await generateQuery(queryWithVariables);
        console.log({ aiquery });
        if (!aiquery.query && aiquery.message) {
          setError(aiquery.message);
          setIsLoading(false);
          return;
        }
        if (aiquery.query) finalQuery = aiquery.query;
      }

      if (isAiPrompt) {
        const { prompt } = seperateCommentsFromSql(query);
        setQuery('-- ' + prompt + '\n' + finalQuery);
      }
      try {
        const response = await fetchData(finalQuery);
        if (!response.length) setError('Empty response.');
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
    const { prompt, sql } = seperateCommentsFromSql(query);
    const { explanations } = await explainQuery(prompt, sql);
    console.log({ explanations });
    setQueryExplanations(explanations);
    setIsLoading(false);
  };

  const getVisualization = () => {
    if (isLoading)
      return (
        <div className='flex h-[300px] items-center justify-center'>
          <Spinner />
        </div>
      );
    // TODO this blocks analayzing the query of there are no data. bad ux
    if (!data?.length)
      return (
        <StarterPlaceholderMessage
          start={() => {
            setQuery(DEFAULT_QUERY);
            runQuery(DEFAULT_QUERY);
          }}
        />
      );
    return (
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
    );
  };

  return (
    <div className='query-wrapper'>
      <div className='editor-wrapper relative mx-10 mb-4 mt-5 flex items-center justify-center'>
        <SqlEditor
          query={query}
          handleClear={handleClear}
          setQuery={setQuery}
          setError={setError}
          isLoading={isLoading}
          runQuery={runQuery}
        />
        <QueryVariablesForm query={query} />
      </div>
      <>{JSON.stringify({ data })}</>
      <div>
        {error && <QueryErrorContainer error={error} setError={setError} />}
        <Card className='relative my-12 h-auto rounded-t-3xl  px-0 py-4 '>
          {getVisualization()}
        </Card>
      </div>
    </div>
  );
};

export default QueryWrapper;
