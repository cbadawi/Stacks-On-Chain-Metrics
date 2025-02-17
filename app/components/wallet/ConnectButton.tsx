'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { prettyAddress } from '@/app/lib/pretty';
import { useUser } from '@/app/contexts/UserProvider';
import { FinishedAuthData } from '@stacks/connect';
import { create } from 'domain';
import { createOwner } from '@/app/lib/db/owner/owner';

interface ConnectWalletProps {
  variant?: 'default' | 'createDcaButton';
}

const ConnectWallet: React.FC<ConnectWalletProps> = () => {
  const { userSession, userData, setUserData } = useUser();
  const [stacksConnect, setStacksConnect] = useState<
    typeof import('@stacks/connect') | null
  >(null);

  // Dynamically import @stacks/connect only on the client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@stacks/connect').then((module) => {
        setStacksConnect(module);
      });
    }
  }, []);

  useEffect(() => {
    if (!stacksConnect || userData) return; // Only run if userData is not already set

    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((data) => {
        setUserData(data);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, [stacksConnect, userData, userSession, setUserData]);

  function authenticate() {
    if (!stacksConnect) return;
    if (userData) {
      console.log({ userData });
      userSession.signUserOut();
      setUserData(undefined);
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
      return;
    }

    const icon =
      typeof window !== 'undefined' ? window.location.origin + '/logo.png' : '';

    stacksConnect.showConnect({
      appDetails: {
        name: 'Stacks Metrics',
        icon,
      },
      redirectTo: '/',
      onFinish: async (payload: FinishedAuthData) => {
        console.log('onFinish', payload);
        if (typeof window !== 'undefined') {
          window.location.reload();
          await createOwner(
            payload.userSession.loadUserData().profile.stxAddress.mainnet,
            payload.userSession.loadUserData().appPrivateKey
          );
        }
      },
      onCancel: () => {
        console.log('Transaction canceled');
      },
      userSession,
    });
  }
  return (
    <Button onClick={authenticate}>
      {userData
        ? prettyAddress(userData.profile.stxAddress.mainnet)
        : 'Connect Wallet'}
    </Button>
  );
};

export default ConnectWallet;
