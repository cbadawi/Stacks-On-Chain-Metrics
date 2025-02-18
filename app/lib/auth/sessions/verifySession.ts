'use server';

import { cookies } from 'next/headers';
import { decryptSession } from './session';
import { redirect } from 'next/navigation';

/**
 * Reads the session cookie and verifies it.
 * If invalid or missing, redirects the user to the login page.
 */
export async function verifySession() {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) {
    redirect('/');
  }
  const session = await decryptSession(token!);
  if (!session || !session.userId || !session.publicKey) {
    redirect('/');
  }
  return session;
}
