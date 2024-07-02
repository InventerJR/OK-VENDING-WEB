'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getAllProducts } from '../../../../api';
import { CONSTANTS } from '@/constants'

const CartModalView = dynamic(() => import('./cart/cart-modal'), { ssr: false });

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
    total_stock: number;
    investment: number;
    clasification: string;
    provider: string;
}

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    products: StockDataObject[];
    categories: string[];
    suppliers: string[];
    openCart: () => void;
    closeCart: () => void;
    isOpenCartModal: boolean;
    currentPage: number;
    totalPages: number;
    nextUrl: string | null;
    prevUrl: string | null;
    setCurrentPage: (page: number) => void;
    fetchProducts: (url?: string) => void;
    setFilters: (search: string, category: string, supplier: string) => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({ children }: ProviderProps) => {
    const [products, setProducts] = useState<StockDataObject[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [suppliers, setSuppliers] = useState<string[]>([]);
    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [supplier, setSupplier] = useState('');

    const fetchProducts = useCallback(async (url?: string) => {
        try {
            const query = new URLSearchParams();
            if (search) query.set('search', search);
            if (category) query.set('category_name', category);
            if (supplier) query.set('supplier', supplier);
            const fetchUrl = url || CONSTANTS.API_BASE_URL+'/products/get_products/?${query.toString()}';
            const response = await getAllProducts(fetchUrl);
            setProducts(response.results);
            setCurrentPage(response.current || 1);
            setTotalPages(Math.ceil(response.count / ITEMS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);

            // Extract unique categories and suppliers from the products
            const uniqueCategories = [...new Set(response.results.map((product: any) => product.category_name))];
            const uniqueSuppliers = [...new Set(response.results.map((product: any) => product.supplier.name))];
            setCategories(uniqueCategories as string[]);
            setSuppliers(uniqueSuppliers as string[]);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, [search, category, supplier]);

    const setFilters = (search: string, category: string, supplier: string) => {
        setSearch(search);
        setCategory(category);
        setSupplier(supplier);
    };

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const openCart = useCallback(() => {
        setIsOpenCartModal(true);
    }, []);

    const closeCart = useCallback(() => {
        setIsOpenCartModal(false);
    }, []);

    const value = {
        products,
        categories,
        suppliers,
        openCart,
        closeCart,
        isOpenCartModal,
        currentPage,
        totalPages,
        nextUrl,
        prevUrl,
        setCurrentPage,
        fetchProducts,
        setFilters
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                {isOpenCartModal && <CartModalView isOpen={isOpenCartModal} onClose={closeCart} />}
                {children}
            </div>
        </Context.Provider>
    );
};
