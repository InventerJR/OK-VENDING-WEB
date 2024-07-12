import { Metadata } from 'next';
import LayoutClientProvider from './layout.client';

export const metadata: Metadata = {
    title: 'Página',
    description: 'Página de ejemplo',
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
    )
}
export default RootLayout;
