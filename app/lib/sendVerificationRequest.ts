import { SendVerificationRequestParams } from 'next-auth/providers/email';
import { resend } from './resend';

export async function sendVerificationRequest(
  params: SendVerificationRequestParams
) {
  const { identifier, url, provider, theme } = params;
  const { host } = new URL(url);

  // TODO host need to be changed
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [identifier],
      subject: `Log in to ${host}`,
      text: `sign in to stacks metrics ${url}.`,
    });
    return;
  } catch (error) {
    throw new Error('Failed to send the verification Email.');
  }
}
