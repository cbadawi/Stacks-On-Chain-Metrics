'use client';
import React, { useEffect } from 'react';
import { prettyAddress } from '@/app/lib/pretty';
import { useUser } from '@/app/contexts/UserProvider';
import { getAppDetails } from '@/app/appDetails';
import { showConnect, UserData } from '@stacks/connect';
import { Button } from '@/components/ui/button';

interface ConnectWalletProps {
  variant?: 'default' | 'createDcaButton';
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({}) => {
  const { userSession, userData, setUserData } = useUser();

  function authenticate() {
    if (userData) {
      userSession.signUserOut();
      setUserData(null);
      window.location.reload();
      return;
    }

    showConnect({
      appDetails: getAppDetails(),
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
      onCancel: () => {
        console.log('tx canceled oops');
      },
      userSession,
    });
  }

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData: UserData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  return (
    <Button
      onClick={authenticate}
      variant={'default'}
      className='font-inherit flex cursor-pointer items-center justify-center rounded bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 text-inherit transition-colors hover:from-red-600 hover:to-orange-600'
    >
      {userData
        ? prettyAddress(userData.profile.stxAddress.mainnet)
        : 'Connect Wallet'}
    </Button>
  );
};

export default ConnectWallet;
