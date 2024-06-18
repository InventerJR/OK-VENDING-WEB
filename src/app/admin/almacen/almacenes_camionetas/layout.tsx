import { Metadata } from 'next';
import LayoutClientProvider from './layout.client';

export const metadata: Metadata = {
  title: 'Administrar Usuarios',
  description: 'Welcome',
}

const RootLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {

  return (
    <LayoutClientProvider>
      {children}
    </LayoutClientProvider>

  );
};
export default RootLayout;
