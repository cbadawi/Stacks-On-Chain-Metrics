'use client';
import { FaPlayCircle } from 'react-icons/fa';
import React, { useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import Spinner from './Spinner';
import QueryVariablesForm from './query/QueryVariablesForm';

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
  // TODO support variables & filters in queries
  // TODO add autocompletion https://stackoverflow.com/questions/69780709/how-can-i-add-auto-completion-to-a-browser-based-editor-using-monaco
  // TODO the Monaco Editor is using useState, hence we cant use SSR here. See if its worth it to switch to SSR / Look for new editors. It also has no name method, can't use the formData method.
  // nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations#displaying-loading-state

  // @ts-ignore
  const editorDidMount = (editor, monaco) => {
    editor.updateOptions({
      fontSize: 18,
      scrollbar: {
        alwaysConsumeMouseWheel: false,
      },
    });
  };

  return (
    <div className='relative grid w-full'>
      <div className='flex h-[33rem] w-full flex-col items-center justify-between p-0 lg:mx-auto lg:flex-row'>
        <Editor
          height='30rem'
          width='100%'
          onChange={(newValue) => setQuery(newValue as string)}
          loading={<Spinner />}
          theme='vs-dark'
          defaultLanguage='sql'
          value={query}
          onMount={editorDidMount}
        />
        <div className='flex h-[3rem]  w-full items-center justify-center hover:h-full lg:ml-4 lg:mt-0 lg:w-1/12 lg:justify-start '>
          <button
            className='btn w-full bg-[#563BD9] hover:bg-[#452AA5] lg:h-full lg:w-full lg:hover:h-[30rem]'
            disabled={isLoading}
            onClick={() => {
              // setQuery(query);
              runQuery(query);
            }}
          >
            {isLoading ? <Spinner /> : <FaPlayCircle size={40} />}
          </button>
        </div>
      </div>
      <QueryVariablesForm
        query={query}
        setQuery={setQuery}
        runQuery={runQuery}
        setError={setError}
      />
    </div>
  );
};

export default SqlEditor;
