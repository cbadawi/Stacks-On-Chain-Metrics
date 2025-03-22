import { Button } from '@/components/ui/button';
import React from 'react';
import { PlayCircle, Sparkles, Command, CornerDownLeft } from 'lucide-react';
import { findIsAIPrompt } from '../lib/ai/cleanQuery';

const RunQueryButton = ({
  isLoading,
  query,
  runQuery,
  handleClear,
}: {
  isLoading: boolean;
  handleClear: () => void;
  query: string;
  runQuery: (query: string) => Promise<void>;
}) => {
  const isAIprompt = findIsAIPrompt(query);

  const getIcon = () => {
    if (isLoading) {
      return;
    }
    if (isAIprompt) {
      return <Sparkles style={{ width: '2.2rem', height: '2.2rem' }} />;
    }
    return <PlayCircle style={{ width: '2.2rem', height: '2.2rem' }} />;
  };

  return (
    <>
      {isLoading && (
        <Button
          variant='ghost'
          className='absolute z-50 mx-10 mb-4 mt-2 flex flex-col items-center'
          onClick={handleClear}
        >
          Clear
        </Button>
      )}
      <Button
        className={`h-[75%] w-[75%] flex-col hover:h-full ${
          isAIprompt
            ? 'bg-gradient-to-tr from-red-400 to-blue-500'
            : 'hover:bg-[#8e2e2e]'
        }`}
        variant='outline'
        size='icon'
        disabled={isLoading}
        onClick={() => {
          runQuery(query);
        }}
      >
        {getIcon()}

        {!isLoading && (
          <div className='run-icon-wrapper mt-2 flex items-center'>
            <Command />+
            <CornerDownLeft />
          </div>
        )}
      </Button>
    </>
  );
};

export default RunQueryButton;
