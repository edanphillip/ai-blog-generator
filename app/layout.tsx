import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/nextjs';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Merriweather as Font } from 'next/font/google';
import { DataContextProvider } from './DataContext';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import './globals.css';

const font = Font({ weight: "400", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: 'AI Blog Generator',
  description: 'Created by Edan Phillip',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html data-theme="aqua" lang="en" className={font.className + "w-screen overflow-x-clip bg-neutral "}>
      <ClerkProvider signInUrl='/login' signUpUrl='/register' appearance={{
        variables: { fontFamily: font.style.fontFamily, fontSize: "22px" },
      }}>
        <DataContextProvider>
          <body className={"badge-neutral "}>
            <div className={"bg-secondary to-neutral via-accent from-neutral bg-gradient-to-t h-fullw-screen"}>
              <NavBar />
              {children}
              <div className={"bg-secondary to-accent via-neutral   bg-gradient-to-t h-full w-screen"}>

                <Footer />
              </div>
            </div >
            <Toaster />
            <Analytics />
          </body  >
        </DataContextProvider>
      </ClerkProvider>
    </html>
  )
}
