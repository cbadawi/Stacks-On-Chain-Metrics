'use client';
import { FaPlayCircle } from 'react-icons/fa';
import React, { useState } from 'react';
import Spinner from './Spinner';
import QueryVariablesForm from './query/QueryVariablesForm';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/theme-terminal';
import { Button } from '@/components/ui/button';

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
  setError,
}: SqlEditorProps) => {
  return (
    <div className='relative grid w-full'>
      <div className='mb-8 flex w-full flex-row items-center justify-between lg:mx-auto lg:flex-row'>
        <AceEditor
          placeholder={query}
          width='100%'
          height='30rem'
          mode='mysql'
          theme='terminal'
          name='sqlEditor'
          onLoad={(editor) =>
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
          <Button
            className='h-[75%] w-[75%]  bg-[#1c0916] text-white hover:h-[95%] hover:bg-[#8e2e2e]'
            variant='outline'
            size='icon'
            color='red'
            disabled={isLoading}
            onClick={() => {
              runQuery(query);
            }}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <FaPlayCircle style={{ width: '2.2rem', height: '2.2rem' }} />
            )}
          </Button>
        </div>
      </div>
      <QueryVariablesForm query={query} />
    </div>
  );
};

export default SqlEditor;
