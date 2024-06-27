import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CartModal = dynamic(() => import('./modals/cart/cart-modal'));
const CartModalTicketView = dynamic(() => import('./modals/cart/ticket-modal'));
export const TASKS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {

    products: any[];
    isOpenCartModal: boolean;
    openCart: () => void;
    closeCart: () => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

/**
 * To be used in the component that will consume the context
 * @returns any
 */
export const useSalesAdminContext = () => useContext(Context);

/** Context Provider Component **/
export const SalesAdminContextProvider = ({
    children,
}: ProviderProps) => {

    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
    
    const onCloseModals = useCallback(() => {
        setIsOpenCartModal(false);
    }, []);

    const value: ContextInterface = {
        products: products,
        isOpenCartModal,
        openCart: () => {
            console.log('open cart');
            setIsOpenCartModal(true);
        },
        closeCart: () => {
            setIsOpenCartModal(false); // Cierra el modal
        }
    };

    return (
        <Context.Provider
            value={value}
        >
            <div className='relative w-full'>
                {<CartModal isOpen={isOpenCartModal} onClose={onCloseModals} openCart={value.openCart} />}
                {children}
            </div>
        </Context.Provider>
    );
};


const products = [
    {
        id: 1,
        name: 'Boing de mango',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 32,
        investment: 10
    },
    {
        id: 1,
        name: 'Boing de manzana',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 10,
        investment: 10
    },
    {
        id: 1,
        name: 'Boing de pepino',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 10,
        investment: 10
    },
    {
        id: 1,
        name: 'Boing de lichi',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 10,
        investment: 10
    },
]