'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getProductStockByUUID, listWarehousesPlaces } from '../../../../../api_categories_products';

const CartModal = dynamic(() => import('./modals/cart/cart-modal'));

export const ITEMS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

type Product = {
    id: number;
    name: string;
    image: string;
    quantity: number;
};

type ContextInterface = {
    products: Product[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    currentPage: number;
    totalPages: number;
    nextUrl: string | null;
    prevUrl: string | null;
    refreshProducts: (url?: string, search?: string) => void;
    setCurrentPage: (page: number) => void;
    warehouses: any[];
    selectedWarehouse: string;
    setSelectedWarehouse: (uuid: string) => void;
    openCart: () => void;
    setQuantities: (quantities: { [key: number]: number }) => void;
    quantities: { [key: number]: number };
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useSalesAdminContext = () => useContext(Context);

export const SalesAdminContextProvider = ({ children }: ProviderProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        const warehouse = localStorage.getItem('selectedWarehouse') || '';
        setSelectedWarehouse(warehouse);
    }, []);

    const openCart = () => {
        setIsOpenCartModal(true);
    };

    const closeCart = () => {
        setIsOpenCartModal(false);
    };

    const refreshProducts = useCallback(async (url?: string, search = searchTerm) => {
        const warehouseUUID = localStorage.getItem('selectedWarehouse');
        if (!warehouseUUID) return;

        try {
            const response = await getProductStockByUUID(warehouseUUID);
            console.log("Products fetched:", response);
            setProducts(response);
            setCurrentPage(1);
            setTotalPages(1);
            setNextUrl(null);
            setPrevUrl(null);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, [searchTerm]);

    const fetchWarehouses = useCallback(async () => {
        try {
            const response = await listWarehousesPlaces();
            console.log("Warehouses fetched:", response);
            setWarehouses(response);
        } catch (error) {
            console.error("Error fetching warehouses:", error);
        }
    }, []);

    useEffect(() => {
        fetchWarehouses();
        if (selectedWarehouse) {
            refreshProducts();
        }
    }, [fetchWarehouses, refreshProducts, selectedWarehouse]);

    const handleWarehouseChange = (uuid: string) => {
        setSelectedWarehouse(uuid);
        localStorage.setItem('selectedWarehouse', uuid);
        refreshProducts();
    };

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
        warehouses,
        selectedWarehouse,
        setSelectedWarehouse: handleWarehouseChange,
        openCart,
        setQuantities,
        quantities
    };

    return (
        <Context.Provider value={value}>
            {children}
            {isOpenCartModal && <CartModal isOpen={isOpenCartModal} onClose={closeCart} />}
        </Context.Provider>
    );
};

export default SalesAdminContextProvider;
