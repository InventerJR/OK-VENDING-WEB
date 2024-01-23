"use client";
import { AppContextProvider } from "@/hooks/useAppContext";
import React from "react";

// import ThemeProvider from "./hooks/theme"
// import CardsProvider from "./hooks/getCards"

export default function ParentProvider({
    children
}: {
    children: React.ReactNode
}) {
    return (
        // <ThemeProvider>
        //     <CardsProvider>
        <>
            <AppContextProvider>
                {children}
            </AppContextProvider>

        </>
        //     </CardsProvider>
        // </ThemeProvider>
    )
}