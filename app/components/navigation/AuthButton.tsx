import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import Spinner from '../Spinner';

const AuthButton = () => {
  const { status, data: session } = useSession();

  if (status === 'loading') return <Spinner />;

  return (
    <Link
      href={
        status === 'authenticated' ? '/api/auth/signout' : '/api/auth/signin'
      }
      className='btn btn-square btn-ghost w-20 text-lg'
    >
      {status === 'authenticated' ? 'Sign Out' : 'Sign In'}
    </Link>
  );
};

export default AuthButton;
