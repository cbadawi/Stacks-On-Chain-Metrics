'use client';

import { PlayCircle } from 'lucide-react';
import React, { useEffect } from 'react';
import Spinner from './Spinner';
import QueryVariablesForm from './query/QueryVariablesForm';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-terminal';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';
import RunQueryButton from './RunQueryButton';

interface SqlEditorProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  runQuery: (query: string) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const SqlEditor = ({
  query,
  setQuery,
  isLoading,
  runQuery,
}: SqlEditorProps) => {
  const { theme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        if (!isLoading) {
          runQuery(query);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoading, query, runQuery]);

  return (
    <Card className='mb-8 flex w-full flex-row items-center justify-between bg-[#272729] lg:mx-auto lg:flex-row'>
      <AceEditor
        placeholder={query}
        width='100%'
        height='30rem'
        mode='mysql'
        theme={theme === 'dark' ? 'terminal' : 'github'}
        name='sqlEditor'
        onLoad={(editor) =>
          // todo
          console.log('set loading and <Spinner /> to false')
        }
        onChange={(newValue) => setQuery(newValue as string)}
        fontSize={14}
        lineHeight={19}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={query}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: false,
          enableSnippets: true,
          enableMobileMenu: true,
          showLineNumbers: true,
          theme: 'ace/theme/tomorrow_night',
          mode: 'ace/mode/javascript',
          tabSize: 2,
        }}
      />
      <div className='flex h-[30rem] w-[5rem] items-center justify-center'>
        <RunQueryButton
          isLoading={isLoading}
          query={query}
          runQuery={runQuery}
        />
      </div>
      <QueryVariablesForm query={query} />
    </Card>
  );
};

export default SqlEditor;
