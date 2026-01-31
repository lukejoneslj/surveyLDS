import type { Metadata } from 'next'
import { DM_Serif_Display, Public_Sans } from 'next/font/google'
import './globals.css'
import { SurveyForm } from '@/components/SurveyForm'

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LDS Beliefs Survey',
  description: 'A survey on Latter-day Saint beliefs, practices, and perspectives.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${dmSerif.variable} ${publicSans.variable} font-sans bg-[#F7F5F2] text-[#2D2A26] min-h-screen selection:bg-[#BAD7D2] selection:text-[#1A3833]`}>
        <main className="min-h-screen flex flex-col items-center py-6 sm:py-12">
          {children}
        </main>
      </body>
    </html>
  )
}
