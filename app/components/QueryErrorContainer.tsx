import React from 'react';
import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface QueryErrorContainerProps {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const QueryErrorContainer = ({ error, setError }: QueryErrorContainerProps) => {
  return (
    <Card
      className='z-9999 flex w-full animate-moveright items-center justify-between overflow-hidden
                  bg-rose-900 px-16 py-4 text-lg tracking-wide transition-all duration-500 ease-in'
    >
      {error}
      <X onClick={() => setError('')} />
    </Card>
  );
};

export default QueryErrorContainer;
