'use client';

import React, { useCallback, useState } from 'react';
import SqlEditor from '../components/SqlEditor';
import QueryErrorContainer from '../components/QueryErrorContainer';
// import QueryVisualization from '../components/query/QueryVisualization';
import StarterPlaceholderMessage from '../components/query/StarterPlaceholderMessage';
import { VariableType } from '../components/helpers';
import QueryVisualization from '../components/query/QueryVisualization';
import { Card } from '@/components/ui/card';
import Spinner from '../components/Spinner';
import { QueryExplanation } from '../lib/types';
import { findIsAIPrompt, seperatePromptFromSql } from '../lib/ai/cleanQuery';
import QueryVariablesForm from '../components/query/QueryVariablesForm';
import { explainQuery, runQueryCombined } from '../lib/ai/query';
import { getTokensUsed } from '../lib/db/owner/tokens';
import { useUser } from '../contexts/UserProvider';

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
  const [variableDefaults, setVariableDefaults] = useState<VariableType>({});
  const [queryExplanations, setQueryExplanations] = useState<
    QueryExplanation[] | null
  >();
  const { userSession, userData } = useUser();
  console.log({ userData, userSession });

  // array containing the type of column. ex ['bar', 'bar', 'line']
  // const [chartColumnsTypes, setChartColumnsTypes] = useState<
  //   CustomizableChartTypes[]
  // >([]);
  // array containing the position of axis.
  // const [chartAxesTypes, setChartAxesTypes] = useState<LeftRight[]>([]);

  const getVariables = (
    errorHandler?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const inputElements = document.getElementsByClassName('variable-input');
    const variables: VariableType = {};
    const hasAllVariables = Array.from(inputElements).every((element) => {
      const classnames = element.className.split(' ');
      const variable = classnames.slice(-1)[0];
      const value = (element as HTMLButtonElement).value;
      if (!value) {
        errorHandler && errorHandler(`Variable "${variable}" not set.`);
        return '';
      }
      variables[variable] = value;
      return true;
    });
    setVariableDefaults(variables);
    return variables;
  };

  const handleClear = () => {
    setError('');
    setIsLoading(false);
    setQueryExplanations(null);
  };

  const runQuery = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setData([]);
      setVariableDefaults({});
      setError('');
      try {
        const vars = getVariables(setError);
        if (findIsAIPrompt(query)) {
          if (!userData) {
            setError('Connnect wallet to run AI prompts.');
            setIsLoading(false);
            return;
          }
          // const tokensLeft = getTokensUsed({
          //   address: userData.profile.stxAddress.mainnet,
          // });

          // if (!tokensLeft) {
          //   setError('Connnect wallet to run AI prompts.');
          //   setIsLoading(false);
          //   return;
          // }
        }
        const { data, displayQuery, isAiPrompt } = await runQueryCombined(
          userData?.profile.stxAddress.mainnet,
          query,
          vars
        );
        setData(data);
        setQueryExplanations(null);
        if (!data.length) setError('Empty response.');
        if (isAiPrompt) setQuery(displayQuery);
      } catch (e: unknown) {
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    },
    [variableDefaults, query]
  );

  const handleExplainQuery = async () => {
    setQueryExplanations(null);
    setIsLoading(true);
    const { prompt, sql } = seperatePromptFromSql(query);
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
      </div>
      <QueryVariablesForm query={query} />
      {/* <>{JSON.stringify({ data })}</> */}
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
