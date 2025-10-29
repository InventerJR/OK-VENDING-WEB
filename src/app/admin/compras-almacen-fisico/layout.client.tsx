// /app/admin/compras-almacen-fisico/layout.client.tsx
"use client";

import { ContextProvider } from './page.context';
import { NavigationProvider } from '@/hooks/navigation-context';

export default function LayoutClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NavigationProvider>
      <ContextProvider>
        {children}
      </ContextProvider>
    </NavigationProvider>
  );
}