"use client";

import { ContextProvider } from './page.context'

export default function LayoutClientProvider({
    children,
}: {
    children: React.ReactNode
}) {
    console.log("client children");
    return (
        <ContextProvider>
            {children}
        </ContextProvider>
    )
}
