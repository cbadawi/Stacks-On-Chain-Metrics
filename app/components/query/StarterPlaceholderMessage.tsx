import { Button } from '@/components/ui/button';
import React from 'react';

const StarterPlaceholderMessage = ({ start }: { start: () => void }) => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <p className='pb-2'>Write in SQL or with an AI prompt</p>
      <p className='pb-2'>No prior experience needed.</p>
      <div className='flex'>
        <Button className='btn btn-outline btn-primary' variant={'secondary'}>
          Read the documentation
        </Button>
        <Button
          className='btn btn-primary ml-2'
          variant={'secondary'}
          onClick={start}
        >
          or Start from a template
        </Button>
      </div>
    </div>
  );
};

export default StarterPlaceholderMessage;
