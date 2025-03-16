'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
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
import { useUser } from '../contexts/UserProvider';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '../contexts/QueryContext';
import { DEFAULT_QUERY } from '@/lib/utils';
import Link from 'next/link';
import { LucideArrowLeft } from 'lucide-react';
import { runQueryCombined } from '../lib/ai/runQueryCombined';
import { explainQuery } from '../lib/ai/explainQuery';

const QueryWrapper = () => {
  const {
    query,
    setQuery,
    setUpdateMode,
    setDashboardId,
    setChartId,
    setChartType,
    chartTitle,
    setChartTitle,
    updateMode,
    dashboardId,
  } = useQuery();
  const { userData } = useUser();
  const searchParams = useSearchParams();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [variableDefaults, setVariableDefaults] = useState<VariableType>({});
  const [queryExplanations, setQueryExplanations] = useState<
    QueryExplanation[] | null
  >(null);
  const latestRequestRef = useRef(0);

  useEffect(() => {
    const updateParam = searchParams.get('updateMode');
    const isUpdate = Boolean(updateParam);
    setUpdateMode(isUpdate);

    if (isUpdate) {
      const sqlParam = searchParams.get('query');
      if (sqlParam && sqlParam !== query) {
        setQuery(sqlParam);
      }
      const chartTitleParam = searchParams.get('chartTitle');
      if (chartTitleParam) setChartTitle(chartTitleParam);

      const dashboardIdParam = searchParams.get('dashboardId');
      if (dashboardIdParam) setDashboardId(Number(dashboardIdParam));

      const chartIdParam = searchParams.get('chartId');
      if (chartIdParam) setChartId(Number(chartIdParam));

      const chartTypeParam = searchParams.get('chartType');
      if (chartTypeParam) setChartType(chartTypeParam);
    }
  }, [
    searchParams,
    setQuery,
    setUpdateMode,
    setChartTitle,
    setDashboardId,
    setChartId,
    setChartType,
  ]);

  const getVariables = (
    errorHandler?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const inputElements = document.getElementsByClassName('variable-input');
    const variables: VariableType = {};

    Array.from(inputElements).forEach((element) => {
      const classNames = element.className.split(' ');
      const variable = classNames[classNames.length - 1];
      const value = (element as HTMLInputElement).value;
      if (!value && errorHandler) {
        errorHandler(`Variable "${variable}" not set.`);
        latestRequestRef.current++;
        setIsLoading(false);
        setData([]);
        return;
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

      const vars = getVariables(setError);

      if (findIsAIPrompt(query) && !userData) {
        setError('Connect wallet to run AI prompts.');
        setIsLoading(false);
        return;
      }

      try {
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
        if (!responseData?.length) setError('Empty response.');
      } catch (e: unknown) {
        if (currentRequestId !== latestRequestRef.current) return;
        setError((e as Error).message);
      } finally {
        if (currentRequestId === latestRequestRef.current) {
          setIsLoading(false);
        }
      }
    },
    [userData, setQuery]
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

  const renderVisualization = () => {
    if (isLoading) {
      return (
        <div className='flex h-[300px] items-center justify-center'>
          <Spinner />
        </div>
      );
    }
    if (!data) {
      return (
        <StarterPlaceholderMessage
          start={() => {
            setQuery(DEFAULT_QUERY);
            runQuery(DEFAULT_QUERY);
          }}
        />
      );
    }
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
      {updateMode && (
        <div>
          <h1 className='mx-10 mt-5 font-semibold'>{chartTitle}</h1>{' '}
          <Link
            href={'/dashboards/' + (dashboardId ?? '')}
            className='mx-10 mt-2 text-blue-500'
          >
            <span className='text-sm'>Back to Dashboards</span>
          </Link>
        </div>
      )}
      <div className='editor-wrapper relative mx-10 mb-4 mt-5 flex items-center justify-center'>
        <SqlEditor
          query={query}
          handleClear={handleClear}
          setQuery={setQuery}
          isLoading={isLoading}
          runQuery={runQuery}
        />
      </div>
      <div className='variables-wrapper relative mx-10 mb-4 mt-5 w-auto'>
        <QueryVariablesForm query={query} />
      </div>
      <div>
        {error && <QueryErrorContainer error={error} setError={setError} />}
        <Card className='relative my-12 h-auto rounded-t-3xl px-0 py-4'>
          {JSON.stringify({ data })}
          {renderVisualization()}
        </Card>
      </div>
    </div>
  );
};

export default QueryWrapper;
