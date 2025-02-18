'use server';

import { cookies } from 'next/headers';
import { decryptSession } from './session';
import { redirect } from 'next/navigation';

/**
 * Reads the session cookie and verifies it.
 * If invalid or missing, return null
 */
export async function verifySession() {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;
  console.log('verifySession', { token });
  if (!token) {
    return null;
  }
  const session = await decryptSession(token!);
  console.log('verifySession', { session });
  if (!session || !session.userId || !session.publicKey) {
    return null;
  }
  return session;
}
