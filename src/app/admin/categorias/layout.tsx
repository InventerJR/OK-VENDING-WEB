import { Metadata } from 'next';
import LayoutClientProvider from './layout.client';

export const metadata: Metadata = {
    title: 'Página',
    description: 'Página de ejemplo',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <LayoutClientProvider>
            {children}
        </LayoutClientProvider>
    )
}
