'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { listProducts } from '../../../../../api_categories_products'; // Ajusta la importación según tu estructura de archivos

const CartModal = dynamic(() => import('./modals/cart/cart-modal'));

export const ITEMS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    products: any[];
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    currentPage: number;
    totalPages: number;
    nextUrl: string | null;
    prevUrl: string | null;
    refreshProducts: (url?: string, search?: string) => void;
    setCurrentPage: (page: number) => void;
    openCart: () => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useSalesAdminContext = () => useContext(Context);

export const SalesAdminContextProvider = ({ children }: ProviderProps) => {
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [isOpenCartModal, setIsOpenCartModal] = useState(false);

    const onCloseModals = useCallback(() => {
        setIsOpenCartModal(false);
    }, []);

    const refreshProducts = useCallback(async (url?: string) => {
        try {
            const response = await listProducts(url);
            setProducts(response.results);
            setCurrentPage(response.current || 1);
            setTotalPages(Math.ceil(response.count / ITEMS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, [searchTerm]);

    useEffect(() => {
        refreshProducts();
    }, [refreshProducts]);

    const value: ContextInterface = {
        products,
        searchTerm,
        setSearchTerm,
        currentPage,
        totalPages,
        nextUrl,
        prevUrl,
        refreshProducts,
        setCurrentPage,
        openCart: () => {
            console.log('open cart');
            setIsOpenCartModal(true);
        }
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                <CartModal isOpen={isOpenCartModal} onClose={onCloseModals} />
                {children}
            </div>
        </Context.Provider>
    );
};

export default SalesAdminContextProvider;
