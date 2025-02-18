'use client';

import React, { useCallback, useRef, useState } from 'react';
import SqlEditor from '../components/SqlEditor';
import QueryErrorContainer from '../components/QueryErrorContainer';
import StarterPlaceholderMessage from '../components/query/StarterPlaceholderMessage';
import { VariableType } from '../components/helpers';
import QueryVisualization from '../components/query/QueryVisualization';
import { Card } from '@/components/ui/card';
import Spinner from '../components/Spinner';
import { QueryExplanation } from '../lib/types';
import { findIsAIPrompt, seperatePromptFromSql } from '../lib/ai/cleanQuery';
import QueryVariablesForm from '../components/query/QueryVariablesForm';
import { explainQuery, runQueryCombined } from '../lib/ai/query';
import { useUser } from '../contexts/UserProvider';

const DEFAULT_QUERY = `-- To write an AI prompt, start with "-- ai" 
-- followed by your prompt here.

-- Postgresql 15
-- You can use variables by wrapping words in double brackets {{}}
select max(block_height) from blocks;`;

const QueryWrapper = () => {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [variableDefaults, setVariableDefaults] = useState<VariableType>({});
  const [queryExplanations, setQueryExplanations] = useState<
    QueryExplanation[] | null
  >(null);
  const { userSession, userData } = useUser();

  const latestRequestRef = useRef(0);

  // todo refactor to not reach into the dom to get variables
  const getVariables = (
    errorHandler?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const inputElements = document.getElementsByClassName('variable-input');
    const variables: VariableType = {};
    Array.from(inputElements).forEach((element) => {
      const classnames = element.className.split(' ');
      const variable = classnames.slice(-1)[0];
      const value = (element as HTMLInputElement).value;
      if (!value && errorHandler) {
        errorHandler(`Variable "${variable}" not set.`);
      }
      variables[variable] = value;
    });
    setVariableDefaults(variables);
    return variables;
  };

  const handleClear = () => {
    setError('');
    setIsLoading(false);
    setQueryExplanations(null);
    latestRequestRef.current++;
  };

  const runQuery = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setData([]);
      setVariableDefaults({});
      setError('');
      const currentRequestId = ++latestRequestRef.current;

      try {
        const vars = getVariables(setError);
        if (findIsAIPrompt(query)) {
          if (!userData) {
            setError('Connect wallet to run AI prompts.');
            setIsLoading(false);
            return;
          }
        }
        const result = await runQueryCombined(
          userData?.profile.stxAddress.mainnet,
          query,
          vars
        );

        if (currentRequestId !== latestRequestRef.current) return;

        if (!result.success) {
          setError(result.message);
          setIsLoading(false);
          return;
        }

        const {
          data: responseData,
          isAiPrompt,
          displayQuery,
        } = result.response;
        if (isAiPrompt) setQuery(displayQuery);
        setData(responseData || []);
        setQueryExplanations(null);
      } catch (e: unknown) {
        if (currentRequestId !== latestRequestRef.current) return;
        setError((e as Error).message);
      }
      if (currentRequestId === latestRequestRef.current) {
        setIsLoading(false);
      }
    },
    [userData, query]
  );

  const handleExplainQuery = async () => {
    setQueryExplanations(null);
    setIsLoading(true);
    const { prompt, sql } = seperatePromptFromSql(query);
    const result = await explainQuery(prompt, sql);

    if (!result.success) {
      setError(result.message);
      setIsLoading(false);
      return;
    }
    setQueryExplanations(result.response.explanations);
    setIsLoading(false);
  };

  const getVisualization = () => {
    if (isLoading)
      return (
        <div className='flex h-[300px] items-center justify-center'>
          <Spinner />
        </div>
      );

    if (!data || data.length === 0)
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
          isLoading={isLoading}
          runQuery={runQuery}
        />
      </div>
      <QueryVariablesForm query={query} />
      <div>
        {error && <QueryErrorContainer error={error} setError={setError} />}
        <Card className='relative my-12 h-auto rounded-t-3xl px-0 py-4 '>
          {getVisualization()}
        </Card>
      </div>
    </div>
  );
};

export default QueryWrapper;
