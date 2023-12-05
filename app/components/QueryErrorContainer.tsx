import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface QueryErrorContainerProps {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const QueryErrorContainer = ({ error, setError }: QueryErrorContainerProps) => {
  return (
    <div className='text-white-70 z-9999 animate-moveright flex w-full items-center justify-between bg-rose-900 px-16 py-4 text-lg tracking-wide transition-all duration-500 ease-in'>
      {error}
      <AiOutlineClose onClick={() => setError('')} />
    </div>
  );
};

export default QueryErrorContainer;
