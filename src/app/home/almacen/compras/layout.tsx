import { Metadata } from 'next';
import { InventoryAdminContextProvider } from './purchases-admin.context'

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
