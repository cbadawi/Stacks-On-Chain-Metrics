import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';

interface RunButtonProps {
  formId?: string;
  disabled: boolean;
}

const RunButton = ({ formId, disabled }: RunButtonProps) => {
  return (
    <Button
      form={formId}
      type='submit'
      disabled={disabled}
      className='h-full w-full'
    >
      <PlayCircle style={{ width: '2.2rem', height: '2.2rem' }} />
    </Button>
  );
};

export default RunButton;
