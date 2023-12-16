'use client';

import React, { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';

type FormSubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
} & ComponentProps<'button'>;

const Button = ({ children, className, ...props }: FormSubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      className={`btn btn-primary ${className}`}
      type='submit'
      disabled={pending}
    >
      {pending && <span className='loading loading-spinner' />}
      {children}
    </button>
  );
};

export default Button;
