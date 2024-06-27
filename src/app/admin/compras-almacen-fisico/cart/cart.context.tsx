import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import CartModalView from './cart-modal';
import CartModalTicketView from './ticket-modal';

export const TASKS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    products: DataObject[];
    isOpenCartModal: boolean;
    isOpenTicketCartModal: boolean; 
    openTicketCart: () => void;
    closeCart: () => void;
    deleteObject: (item: DataObject) => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

/**
 * To be used in the component that will consume the context
 * @returns any
 */
export const useCartContext = () => useContext(Context);

/** Context Provider Component **/
export const CartContextProvider = ({ children }: ProviderProps) => {
    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
    const [isOpenTicketCartModal, setIsOpenTicketCartModal] = useState(false);

    const value: ContextInterface = {
        products: products,
        isOpenCartModal,
        isOpenTicketCartModal,
        openTicketCart: () => {
            console.log('open ticket cart');
            setIsOpenTicketCartModal(true);
        },
        closeCart: () => {
            setIsOpenCartModal(false); 
            setIsOpenTicketCartModal(false); 
        },
        deleteObject: (item: DataObject) => {}
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                {isOpenCartModal && <CartModalView isOpen={isOpenCartModal} onClose={value.closeCart} />}
                {isOpenTicketCartModal && <CartModalTicketView isOpen={isOpenTicketCartModal} onClose={() => setIsOpenTicketCartModal(false)} />}
                {children}
            </div>
        </Context.Provider>
    );
};


const products: DataObject[] = [
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
]


export type DataObject = {
    id: number;
    name: string;
    image: string;
    purchase_price: number;
    sale_price: number;
    stock: number;
    investment: number;
}