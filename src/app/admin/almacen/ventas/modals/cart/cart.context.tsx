import React, { createContext, useContext } from 'react';
import { useSalesAdminContext } from '../../sales-admin.context';

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    products: any[];
    quantities: { [key: number]: number };
    deleteObject: (item: any) => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useCartContext = () => useContext(Context);

export const CartContextProvider = ({ children }: ProviderProps) => {
    const { products, quantities } = useSalesAdminContext();

    const deleteObject = (item: any) => {
        // Implementa la lógica para eliminar el objeto del carrito
    };

    const value: ContextInterface = {
        products,
        quantities,
        deleteObject
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                {children}
            </div>
        </Context.Provider>
    );
};
