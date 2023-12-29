import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ConnectedAccountProvider } from '@/context/ConnectedAccountContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}


declare global {
  interface Window {
    ethereum?: any;
  }
}


export default function RootLayout({ children }: {children: React.ReactNode}) { 
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConnectedAccountProvider>
          <Header />
          {children}
          <Footer />
        </ConnectedAccountProvider>
      </body>
    </html>
  )
}
