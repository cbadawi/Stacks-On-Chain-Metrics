import { redirect } from 'next/navigation';
import { createSession, deleteSession } from './sessions/sessionManagement';

export const messageToSign = 'Sign message to login, no tx fee incurred.';

export async function signup(params: {
  address: string;
  publicKey: string;
  signature: string;
}) {
  await createSession(params.address, params.publicKey, params.signature);
  // redirect('/');
}

export async function signout() {
  await deleteSession();
  redirect('/');
}
