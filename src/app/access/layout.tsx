import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { CenteredForms } from '@/components/layouts/centered-form'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Login Page',
  description: 'Log into your account',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CenteredForms
      // backgroundImage='/bg2.jpg'
      backgroundImage='/bg.jpeg'
      blur_bg={false}
    >
      {children}
    </CenteredForms>
  )
}
