"use client";

import { ContextProvider } from './page.context'

const LayoutClientProvider = ({
    children,
}: {
    children: React.ReactNode
}) =>{
    console.log("client children");
    return (
        <ContextProvider>
            {children}
        </ContextProvider>
    );
};
export default LayoutClientProvider;
