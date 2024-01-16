import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administrar Usuarios',
  description: 'Welcome',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    children 
  )
}
