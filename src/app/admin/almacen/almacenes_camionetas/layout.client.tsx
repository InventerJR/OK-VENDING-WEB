"use client";

import { SalesAdminContextProvider } from './sales-admin.context'

const LayoutClientProvider = ({
    children,
}: {
    children: React.ReactNode
}) =>{
    console.log("client children");
    return (
        <SalesAdminContextProvider>
            {children}
        </SalesAdminContextProvider>
    );
};
export default LayoutClientProvider;