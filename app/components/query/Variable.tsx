import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface VariableProps {
  value?: string;
  variable: string;
  inputPlaceholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Variable = ({
  variable,
  inputPlaceholder = 'variable',
  value,
  onChange,
}: VariableProps) => {
  return (
    <div className='filter-wrap overflow-auto rounded-3xl border px-3 py-2'>
      <Label htmlFor={variable} className='ml-3'>
        {variable}
      </Label>
      <Input
        id={variable}
        name={variable}
        autoComplete='off'
        className={`variable-input border-none shadow-none ${variable} `}
        placeholder={inputPlaceholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Variable;
