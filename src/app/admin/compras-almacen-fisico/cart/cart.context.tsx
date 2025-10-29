'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import CartModalView from './cart-modal';
import CartModalTicketView from './ticket-modal';
import { getAllSuppliers } from '../../../../../api';
import { localStorageWrapper } from '@/utils/localStorageWrapper';


export const TASKS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

export type DataObject = {
    package_quantity: number;
    expiration: any;
    id: number;
    name: string;
    image: string;
    purchase_price: number;
    sale_price: number;
    stock: number;
    investment: number;
    quantity: number;
};

export type SupplierObject = {
    id: number;
    name: string;
    uuid: string;
};

type ContextInterface = {
    products: DataObject[];
    setProducts: React.Dispatch<React.SetStateAction<DataObject[]>>;
    suppliers: SupplierObject[];
    fetchSuppliers: () => void;
    isOpenCartModal: boolean;
    isOpenTicketCartModal: boolean;
    openTicketCart: () => void;
    closeCart: () => void;
    addObject: (product: DataObject) => void;
    deleteObject: (index: number) => void;
    updateObjectQuantity: (id: number, quantity: number) => void;
    updateProduct: (index: number, field: keyof DataObject, value: any) => void;
    openCartModal: () => void;
    closeTicketCart: () => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useCartContext = () => useContext(Context);

export const CartContextProvider = ({ children }: ProviderProps) => {
    const [products, setProducts] = useState<DataObject[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierObject[]>([]);
    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
    const [isOpenTicketCartModal, setIsOpenTicketCartModal] = useState(false);

    useEffect(() => {
        const storedProducts = JSON.parse(localStorageWrapper.getItem('registeredProducts') || '[]');
        setProducts(storedProducts);
    }, []);

    const fetchSuppliers = async () => {
        try {
            const data = await getAllSuppliers();
            setSuppliers(data);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    };

    const addObject = (product: DataObject) => {
        const existingProductIndex = products.findIndex(p => p.id === product.id);
        let updatedProducts;
        if (existingProductIndex >= 0) {
            updatedProducts = [...products];
            updatedProducts[existingProductIndex].quantity += 1;
        } else {
            updatedProducts = [...products, { ...product, quantity: 1 }];
        }
        setProducts(updatedProducts);
        localStorageWrapper.setItem('registeredProducts', JSON.stringify(updatedProducts));
    };

    const deleteObject = (index: number) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
        localStorageWrapper.setItem('registeredProducts', JSON.stringify(updatedProducts));
    };

    const updateObjectQuantity = (id: number, quantity: number) => {
        const updatedProducts = products.map(product => {
            if (product.id === id) {
                return { ...product, quantity };
            }
            return product;
        });
        setProducts(updatedProducts);
        localStorageWrapper.setItem('registeredProducts', JSON.stringify(updatedProducts));
    };

    const updateProduct = (index: number, field: keyof DataObject, value: any) => {
        const updatedProducts = [...products];
        //@ts-ignore
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);
        localStorageWrapper.setItem('registeredProducts', JSON.stringify(updatedProducts));
    };

    const openTicketCart = () => {
        setIsOpenTicketCartModal(true);
    };

    const closeCart = () => {
        setIsOpenCartModal(false);
    };

    const closeTicketCart = () => {
        setIsOpenTicketCartModal(false);
    };

    const openCartModal = () => {
        setIsOpenCartModal(true);
    };

    const value: ContextInterface = {
        products,
        setProducts,
        suppliers,
        fetchSuppliers,
        isOpenCartModal,
        isOpenTicketCartModal,
        openTicketCart,
        closeCart,
        addObject,
        deleteObject,
        updateObjectQuantity,
        updateProduct,
        openCartModal,
        closeTicketCart,
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                {isOpenCartModal && <CartModalView isOpen={isOpenCartModal} onClose={closeCart} />}
                {isOpenTicketCartModal && <CartModalTicketView isOpen={isOpenTicketCartModal} onClose={closeTicketCart} />}
                {children}
            </div>
        </Context.Provider>
    );
};
