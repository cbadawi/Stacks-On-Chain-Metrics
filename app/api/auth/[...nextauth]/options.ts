import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/app/lib/db/client';
import { sendVerificationRequest } from '@/app/lib/sendVerificationRequest';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // TODO change  from: 'onboarding@resend.dev',
    {
      id: 'email',
      type: 'email',
      from: 'onboarding@resend.dev',
      server: {},
      maxAge: 24 * 60 * 60,
      name: 'Email',
      options: {},
      sendVerificationRequest,
    },
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
};
