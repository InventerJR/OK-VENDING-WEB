"use client";

import { PurchasesAdminContextProvider } from './purchases-admin.context'

const LayoutClientProvider = ({
    children,
}: {
    children: React.ReactNode
}) =>{
    console.log("client children");
    return (
        <PurchasesAdminContextProvider>
            {children}
        </PurchasesAdminContextProvider>
    );
};
export default LayoutClientProvider;