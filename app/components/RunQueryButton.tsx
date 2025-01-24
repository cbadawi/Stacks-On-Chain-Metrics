import { Button } from '@/components/ui/button';
import React from 'react';
import Spinner from './Spinner';
import { PlayCircle, Sparkles, Command, CornerDownLeft } from 'lucide-react';
import { findIsAIPrompt } from '../query/isAIPrompt';

const RunQueryButton = ({
  isLoading,
  query,
  runQuery,
}: {
  isLoading: boolean;
  query: string;
  runQuery: (query: string) => Promise<void>;
}) => {
  const isAIprompt = findIsAIPrompt(query);

  const getIcon = () => {
    if (isLoading) {
      return <Spinner />;
    }
    if (isAIprompt) {
      return <Sparkles style={{ width: '2.2rem', height: '2.2rem' }} />;
    }
    return <PlayCircle style={{ width: '2.2rem', height: '2.2rem' }} />;
  };

  return (
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
        <div className='mt-2 flex items-center'>
          <Command />+
          <CornerDownLeft />
        </div>
      )}
    </Button>
  );
};

export default RunQueryButton;
