import { Input } from '@/components/input'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Welcome',
}

export default function AdminPage() {
  return (
    <main className="flex flex-col items-center justify-between py-6 px-24 max-w-2xl w-fit">
      <span>dashboard page</span>
    </main>
  )
}
