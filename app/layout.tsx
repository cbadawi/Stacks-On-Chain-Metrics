import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/navigation/Navbar';
import Options from './components/navigation/Options';
import AuthProvider from './AuthProvider';
import Footer from './components/navigation/Footer';

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
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <Options />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
