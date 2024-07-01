'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CartModalView = dynamic(() => import('./cart/cart-modal'));

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    name: string;
    type: string;
    address: string;
}

export type StockDataObject = {
    id: number;
    name: string;
    image: string;
    purchase_price: number;
    sale_price: number;
    stock: number;
    investment: number;
    clasification: string;
    provider: string;
}

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {

    data: any[];
    products: any[];
    openCart: () => void;
    deleteObject: (object: any) => void;
    isOpenCartModal: boolean;
    closeCart: () => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

/**
 * to be used in components that are children of the Context Provider
 * @returns any
 */
export const usePageContext = () => useContext(Context);


/** Context Provider Component **/
export const ContextProvider = ({
    children,
}: ProviderProps) => {

    const data: DataObject[] = [
        {
            id: 1,
            name: 'Machine 1',
            type: 'Type 1',
            address: 'Address 1',
        },
        {
            id: 3,
            name: 'Machine 3',
            type: 'Type 3',
            address: 'Address 3',
        },
        {
            id: 3,
            name: 'Machine 3',
            type: 'Type 3',
            address: 'Address 3',
        },
    ];

    const products: StockDataObject[] = [
        {
            id: 1,
            name: 'Boing de manzana',
            image: '',
            purchase_price: 10000,
            sale_price: 10.50,
            stock: 10,
            investment: 1000000,
            clasification: "caja",
            provider: ""
        },
        {
            id: 1,
            name: 'Boing de manzana',
            image: '',
            purchase_price: 10000,
            sale_price: 10.50,
            stock: 10,
            investment: 1000000,
            clasification: "caja",
            provider: ""
        },
        {
            id: 1,
            name: 'Boing de manzana',
            image: '',
            purchase_price: 10000,
            sale_price: 10.50,
            stock: 10,
            investment: 1000000,
            clasification: "caja",
            provider: ""
        },
        {
            id: 1,
            name: 'Boing de manzana',
            image: '',
            purchase_price: 10000,
            sale_price: 10.50,
            stock: 10,
            investment: 1000000,
            clasification: "caja",
            provider: ""
        },
        {
            id: 1,
            name: 'Boing de manzana',
            image: '',
            purchase_price: 10000,
            sale_price: 10.50,
            stock: 10,
            investment: 1000000,
            clasification: "caja",
            provider: ""
        },
        {
            id: 1,
            name: 'Boing de manzana',
            image: '',
            purchase_price: 10000,
            sale_price: 10.50,
            stock: 10,
            investment: 1000000,
            clasification: "caja",
            provider: ""
        },
    ];

    const [current_object, setCurrentObject] = useState(null);

    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
    

    const onCloseModals = useCallback(() => {
        setIsOpenCartModal(false);
    }, []);

    const openCart = useCallback(() => {
        setIsOpenCartModal(true);
    }, []);

    const closeCart = useCallback(() => {
        setIsOpenCartModal(false);
    }, []);

    const value: ContextInterface = {
        products: products,
        data: data,
        isOpenCartModal,
        openCart: () => {
            console.log('open cart');
            setIsOpenCartModal(true);
        },
        closeCart: () => {
            setIsOpenCartModal(false); // Cierra el modal
        },
        deleteObject: (object: any) => {}
    };

    return (
        <Context.Provider
            value={value}
        >
            <div className='relative w-full'>
                <CartModalView isOpen={isOpenCartModal} onClose={onCloseModals} />
                {children}
            </div>
        </Context.Provider>
    );
};

const products: StockDataObject[] = [
    {
        id: 1,
        name: 'Boing de manzana',
        image: '',
        purchase_price: 10000,
        sale_price: 10.50,
        stock: 10,
        investment: 1000000,
        clasification: "caja",
        provider: ""
    },
];
