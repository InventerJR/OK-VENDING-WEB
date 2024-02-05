"use client";
import { AppContextProvider } from "@/hooks/useAppContext";
import React from "react";

export default function ParentProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <AppContextProvider>
            {children}
        </AppContextProvider>
    )
}