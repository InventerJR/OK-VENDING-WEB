"use client";

import { CategoryProvider } from './page.context';

const LayoutClientProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    console.log("client children");
    return (
        <CategoryProvider>
            {children}
        </CategoryProvider>
    );
};

export default LayoutClientProvider;
