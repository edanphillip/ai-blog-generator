import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Playpen_Sans as Font } from 'next/font/google'
import './globals.css'
import NavBar from './components/NavBar'
import { Toaster } from '@/components/ui/toaster'

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
    <html data-theme="aqua" lang="en" className={font.className + " bg-neutral "}>
      <ClerkProvider signInUrl='/login' signUpUrl='/register' appearance={{
        variables: { fontFamily: font.style.fontFamily, fontSize: "22px" },
      }}>
        <body className={"badge-neutral  "}>
          <NavBar />
          <div className={"bg-secondary to-primary from-neutral bg-gradient-to-tr "}>
            {children}
          </div >
          <Toaster />
        </body  >
      </ClerkProvider>
    </html>
  )
}
