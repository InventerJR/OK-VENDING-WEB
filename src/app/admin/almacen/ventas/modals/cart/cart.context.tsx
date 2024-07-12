import React, { createContext, useContext, useState } from 'react';
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
    const { products: initialProducts, quantities: initialQuantities } = useSalesAdminContext();
    const [products, setProducts] = useState(initialProducts);
    const [quantities, setQuantities] = useState(initialQuantities);

    const deleteObject = (item: any) => {
        setProducts(prevProducts => prevProducts.filter(product => product.product.id !== item.product.id));
        const newQuantities = { ...quantities };
        delete newQuantities[item.product.id];
        setQuantities(newQuantities);
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