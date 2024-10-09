import { Metadata } from 'next';
import LayoutClientProvider from './layout.client';

export const metadata: Metadata = {
    title: 'Historial de Compras',
    description: 'Visualiza el historial completo de compras realizadas, incluyendo detalles de proveedores, productos y fechas.',
};

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
}

export default RootLayout;
