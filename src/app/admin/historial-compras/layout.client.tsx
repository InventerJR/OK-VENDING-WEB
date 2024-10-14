"use client";

import { PurchaseProvider } from './page.context';

const LayoutClientProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <PurchaseProvider>
            {children}
        </PurchaseProvider>
    );
};

export default LayoutClientProvider;
