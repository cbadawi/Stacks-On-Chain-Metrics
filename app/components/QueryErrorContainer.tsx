import React from 'react';
import { X } from 'lucide-react';

interface QueryErrorContainerProps {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const QueryErrorContainer = ({ error, setError }: QueryErrorContainerProps) => {
  return (
    <div className='z-9999 flex w-full animate-moveright items-center justify-between bg-rose-900 px-16 py-4 text-lg tracking-wide transition-all duration-500 ease-in'>
      {error}
      <X onClick={() => setError('')} />
    </div>
  );
};

export default QueryErrorContainer;
