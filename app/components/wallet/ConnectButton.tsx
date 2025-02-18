'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { prettyAddress } from '@/app/lib/pretty';
import { useUser } from '@/app/contexts/UserProvider';
import { FinishedAuthData } from '@stacks/connect';
import { createOwner } from '@/app/lib/db/owner/owner';
import { getAppDetails } from '@/lib/appDetails';
import { STACKS_MAINNET } from '@stacks/network';
import { verifyMessageSignatureRsv } from '@stacks/encryption';

import { getAddressFromPublicKey } from '@stacks/transactions';
import { createSession as createSessionServer } from '@/app/lib/auth/sessions/sessionManagement';
import { messageToSign, signout, signup } from '@/app/lib/auth/auth';

interface ConnectWalletProps {
  variant?: 'default' | 'createDcaButton';
}

const ConnectWallet: React.FC<ConnectWalletProps> = () => {
  const { userSession, userData, setUserData } = useUser();
  const [stacksConnect, setStacksConnect] = useState<
    typeof import('@stacks/connect') | null
  >(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@stacks/connect').then((module) => {
        setStacksConnect(module);
      });
    }
  }, []);

  useEffect(() => {
    if (!stacksConnect || userData) return;

    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((data) => {
        setUserData(data);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, [stacksConnect, userData, userSession, setUserData]);

  async function signMessage(): Promise<void> {
    if (!stacksConnect) return;
    return stacksConnect.openSignatureRequestPopup({
      message: messageToSign,
      network: STACKS_MAINNET,
      appDetails: getAppDetails(),
      async onFinish(data) {
        const { signature, publicKey } = data;
        console.log({ data });
        await signup({
          publicKey,
          signature,
          address: userData?.profile.stxAddress.mainnet,
        });
      },
    });
  }

  async function authenticate() {
    if (!stacksConnect) return;
    if (userData) {
      userSession.signUserOut();
      setUserData(undefined);
      if (typeof window !== 'undefined') {
        signout();
        window.location.reload();
      }
      return;
    }

    stacksConnect.showConnect({
      appDetails: getAppDetails(),
      redirectTo: '/',
      onFinish: async (payload: FinishedAuthData) => {
        console.log('onFinish', payload);
        if (typeof window !== 'undefined') {
          await signMessage();
          window.location.reload();
          await createOwner(
            payload.userSession.loadUserData().profile.stxAddress.mainnet,
            payload.userSession.loadUserData().appPrivateKey
          ).catch((e) => {});
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
function encodeStructuredDataBytes(arg0: {
  message: string;
  domain: any;
}): any {
  throw new Error('Function not implemented.');
}

function sha256(arg0: any) {
  throw new Error('Function not implemented.');
}
