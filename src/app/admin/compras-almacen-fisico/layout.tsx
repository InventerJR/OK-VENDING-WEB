// /app/admin/compras-almacen-fisico/layout.tsx
import LayoutClientProvider from './layout.client';

export default function ComprasAlmacenFisicoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutClientProvider>
      {children}
    </LayoutClientProvider>
  );
}