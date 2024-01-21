import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'

import { Inter as Font } from 'next/font/google'
import './globals.css'

const inter = Font({ weight: "400", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      </head>
      <ClerkProvider >
        <body className={inter.className + "text-black bg-green-50"}>{children}</body>
      </ClerkProvider>
    </html>
  )
}
