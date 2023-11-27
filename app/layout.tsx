import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
// TODO improve SEO
export const metadata: Metadata = {
  title: 'Stacks On Chain Metrics',
  description: 'Data, API & Analytics for the Stacks Blockchain ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO add headers, footers, navbars and sidebars here
  return (
    <html lang='en' className='bg-slate-900'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
