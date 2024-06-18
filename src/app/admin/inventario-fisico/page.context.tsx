'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';


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
}

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {

    data: any[];
    products: any[];
    openCart: () => void;
    createObject: () => void;
    editObject: (object:any) => void;
    deleteObject: (object:any) => void;
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
            name: 'Boing de mango',
            image: '',
            purchase_price: 10,
            sale_price: 10.50,
            stock: 10,
            investment: 10
        },
        {
            id: 1,
            name: 'Boing de manzana',
            image: '',
            purchase_price: 10000,
            sale_price: 10.50,
            stock: 10,
            investment: 1000000
        },
        {
            id: 1,
            name: 'Boing de mango',
            image: '',
            purchase_price: 10,
            sale_price: 10.50,
            stock: 10,
            investment: 10
        },
        {
            id: 1,
            name: 'Boing de mango',
            image: '',
            purchase_price: 10,
            sale_price: 10.50,
            stock: 10,
            investment: 10
        },
        {
            id: 1,
            name: 'Boing de mango',
            image: '',
            purchase_price: 10,
            sale_price: 10.50,
            stock: 10,
            investment: 10
        },
        {
            id: 1,
            name: 'Boing de mango',
            image: '',
            purchase_price: 10,
            sale_price: 10.50,
            stock: 10,
            investment: 10
        },
        {
            id: 1,
            name: 'Boing de mango',
            image: '',
            purchase_price: 10,
            sale_price: 10.50,
            stock: 10,
            investment: 10
        },
    ];

    const [current_object, setCurrentObject] = useState(null);

    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenCartModal, setIsOpenCartModal] = useState(false);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const value = {
        data,
        products : products,
        createObject: () => {
            onCloseModals();
            setIsOpenCreateModal(true);
        },
        editObject: (object:any) => {
            onCloseModals();
            setCurrentObject(object);
            setIsOpenUpdateModal(true);
        },
        deleteObject: (object:any) => {
            onCloseModals();
            setCurrentObject(object);
            setIsOpenDeleteModal(true);
        },
        openCart: () => {
            console.log('open cart');
            setIsOpenCartModal(true);
        },
    };

    return (
        <Context.Provider
            value={value}
        >
            <div className='relative w-full'>
                
                {children}
            </div>
        </Context.Provider>
    );
};

const products: StockDataObject[] = [
    {
        id: 1,
        name: 'Boing de mango',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 10,
        investment: 10
    },
    {
        id: 1,
        name: 'Boing de manzana',
        image: '',
        purchase_price: 10000,
        sale_price: 10.50,
        stock: 10,
        investment: 1000000
    },
    {
        id: 1,
        name: 'Boing de mango',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 10,
        investment: 10
    },
    {
        id: 1,
        name: 'Boing de mango',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 10,
        investment: 10
    },
    {
        id: 1,
        name: 'Boing de mango',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 10,
        investment: 10
    },
    {
        id: 1,
        name: 'Boing de mango',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 10,
        investment: 10
    },
    {
        id: 1,
        name: 'Boing de mango',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 10,
        investment: 10
    },
];
