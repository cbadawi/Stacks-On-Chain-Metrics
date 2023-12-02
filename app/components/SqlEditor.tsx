'use client';
import { FaPlayCircle } from 'react-icons/fa';
import React, { useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import Spinner from './Spinner';

interface SqlEditorProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  runQuery: () => Promise<void>;
}

const SqlEditor = ({
  query,
  setQuery,
  isLoading,
  runQuery,
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
    <div className='relative flex'>
      <div className='relative mx-auto flex h-[30rem] w-[97%] items-center justify-between p-0'>
        <Editor
          className='h-full'
          height='30rem'
          width='100%'
          onChange={(newValue) => setQuery(newValue as string)}
          loading={<Spinner />}
          theme='vs-dark'
          defaultLanguage='sql'
          value={query}
          onMount={editorDidMount}
        />
        <div className='flex h-full items-center'>
          <button
            className='btn ml-[0.2rem] h-[70%] bg-[#563BD9] hover:h-full hover:bg-[#563BD9]'
            disabled={isLoading}
            onClick={() => {
              setQuery(query);
              runQuery();
            }}
          >
            {isLoading ? <Spinner /> : <FaPlayCircle size={40} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SqlEditor;
