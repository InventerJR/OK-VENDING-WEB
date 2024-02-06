import { Metadata } from 'next';
import { UsersAdminContextProvider } from './users-admin.context'

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
