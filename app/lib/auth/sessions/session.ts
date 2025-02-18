'use server';

import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error('SESSION_SECRET environment variable is not set.');
}
const encodedKey = new TextEncoder().encode(secretKey);

/** Encrypt session payload (userId, publicKey, expiration) */
export async function encryptSession(payload: {
  userId: string;
  publicKey: string;
  expiresAt: number;
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(encodedKey);
}

/** Decrypt and verify session token */
export async function decryptSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as {
      userId: string;
      publicKey: string;
      expiresAt: number;
    };
  } catch (err) {
    console.error('Failed to verify session token:', err);
    return null;
  }
}
