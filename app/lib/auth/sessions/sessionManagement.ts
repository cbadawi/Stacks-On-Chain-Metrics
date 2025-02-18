'use server';

import { cookies } from 'next/headers';
import { encryptSession } from './session';
import { verifyMessageSignatureRsv } from '@stacks/encryption';
import { messageToSign } from '../auth';

/**
 * Creates a session cookie valid for 7 days.
 * Call this after a successful wallet authentication.
 */
export async function createSession(
  address: string,
  publicKey: string,
  signature: string
) {
  const verified = verifyMessageSignatureRsv({
    message: messageToSign,
    publicKey,
    signature,
  });
  if (!verified) return;

  // Set expiration as a Unix timestamp (7 days from now)
  const expiresAt = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const sessionToken = await encryptSession({
    userId: address,
    publicKey,
    expiresAt,
  });

  const cookieStore = cookies();
  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(expiresAt * 1000),
    sameSite: 'strict',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = cookies();
  cookieStore.delete('session');
}
