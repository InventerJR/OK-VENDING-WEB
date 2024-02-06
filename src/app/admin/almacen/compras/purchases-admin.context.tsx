import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CartModal = dynamic(() => import('./modals/cart/cart-modal'));

export const TASKS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {

    products: any[];

    openCart: () => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

/**
 * To be used in the component that will consume the context
 * @returns any
 */
export const usePurchasesAdminContext = () => useContext(Context);

/** Context Provider Component **/
export const PurchasesAdminContextProvider = ({
    children,
}: ProviderProps) => {

    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
    
    const onCloseModals = useCallback(() => {
        setIsOpenCartModal(false);
    }, []);

    const value: ContextInterface = {
        products: products,
        
        openCart: () => {
            console.log('open cart');
            setIsOpenCartModal(true);
        }
    };

    return (
        <Context.Provider
            value={value}
        >
            <div className='relative w-full'>
                {<CartModal isOpen={isOpenCartModal} onClose={onCloseModals} />}
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