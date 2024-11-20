"use client";

import { AppContextProvider } from "@/hooks/useAppContext";
import { NavigationProvider } from "@/hooks/navigation-context";
import React from "react";

export default function ParentProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <NavigationProvider>
            <AppContextProvider>
                {children}
            </AppContextProvider>
        </NavigationProvider>
    )
}