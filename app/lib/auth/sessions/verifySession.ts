'use server';

import { cookies } from 'next/headers';
import { decryptSession } from './session';
import { getAddressFromPublicKey } from '@stacks/transactions';

/**
 * Reads the session cookie and verifies it.
 * If invalid or missing, return null
 */
export async function verifySession() {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) {
    return null;
  }
  const session = await decryptSession(token!);
  // console.log('verifySession', {
  //   session,
  //   address: getAddressFromPublicKey(session?.publicKey || ''),
  // });
  if (
    !session ||
    !session.userId ||
    !session.publicKey ||
    session.userId !== getAddressFromPublicKey(session.publicKey)
  ) {
    return null;
  }
  return session;
}
