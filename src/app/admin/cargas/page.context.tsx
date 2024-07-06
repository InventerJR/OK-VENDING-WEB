'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getWarehousePlaces, getWarehouseWaggons, getProducts, loadWaggon } from '../../../../apiDono';
import { CONSTANTS } from '@/constants';
import { getAllProducts } from '../../../../api';

const CartModalView = dynamic(() => import('./cart/cart-modal'), { ssr: false });

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    name: string;
    type: string;
    address: string;
};

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
};

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    warehouses: any[];
    categories: string[];
    suppliers: string[];
    fetchProductsByOrigin: (origin: string) => Promise<void>;
    handleConfirmLoad: (loadData: any) => void;
    fetchAllWaggons: () => Promise<any>;
    setFilters: (search: string, category: string, supplier: string) => void;
    openCart: () => void;
    closeCart: () => void;
    isOpenCartModal: boolean;
    products: StockDataObject[];
    currentPage: number;
    totalPages: number;
    nextUrl: string | null;
    prevUrl: string | null;
    setCurrentPage: (page: number) => void;
    fetchProducts: (url?: string) => void;
    waggons: any[];
    setWaggons: React.Dispatch<React.SetStateAction<any[]>>;
    origin: string; // Añadir aquí
    setOrigin: (origin: string) => void; // Añadir aquí
    destination: string;
    setDestination: (destination: string) => void;
    cash: string;
    setCash: (cash: string) => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({ children }: ProviderProps) => {
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [suppliers, setSuppliers] = useState<string[]>([]);
    const [products, setProducts] = useState<StockDataObject[]>([]);
    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [supplier, setSupplier] = useState('');
    const [waggons, setWaggons] = useState<any[]>([]);
    const [origin, setOrigin] = useState(''); // Añadir aquí
    const [destination, setDestination] = useState<string>('');
    const [cash, setCash] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const warehousePlaces = await getWarehousePlaces();
                setWarehouses(warehousePlaces.results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const fetchProductsByOrigin = async (origin: string) => {
        try {
            const query = new URLSearchParams({ origin });
            const fetchUrl = `${CONSTANTS.API_BASE_URL}/products/get_products/?${query.toString()}`;
            const response = await getAllProducts(fetchUrl);
            setProducts(response.results);
        } catch (error) {
            console.error('Error fetching products by origin:', error);
        }
    };

    const fetchAllWaggons = async () => {
        try {
            const response = await getWarehouseWaggons();
            setWaggons(response.results);
        } catch (error) {
            console.error('Error fetching waggons:', error);
            setWaggons([]);
        }
    };

    const handleConfirmLoad = async (loadData: any) => {
        try {
            await loadWaggon({
                waggon_uuid: loadData.destination,
                place_uuid: loadData.origin,
                products: loadData.products,
                change: loadData.cash,
            });
        } catch (error) {
            console.error('Error confirming load:', error);
        }
    };

    const fetchProducts = useCallback(async (url?: string) => {
        try {
            const query = new URLSearchParams();
            if (search) query.set('search', search);
            if (category) query.set('category_name', category);
            if (supplier) query.set('supplier', supplier);
            const fetchUrl = url || `${CONSTANTS.API_BASE_URL}/products/get_products/?${query.toString()}`;
            const response = await getAllProducts(fetchUrl);
            setProducts(response.results);
            setCurrentPage(response.current || 1);
            setTotalPages(Math.ceil(response.count / ITEMS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);

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
        fetchAllWaggons(); // Llamar a fetchAllWaggons aquí para obtener todas las camionetas
    }, [fetchProducts]);

    const openCart = useCallback(() => {
        setIsOpenCartModal(true);
    }, []);

    const closeCart = useCallback(() => {
        setIsOpenCartModal(false);
    }, []);

    const value = {
        warehouses,
        categories,
        suppliers,
        fetchProductsByOrigin,
        handleConfirmLoad,
        fetchAllWaggons, // Asegurarse de tener fetchAllWaggons en el contexto
        setFilters,
        openCart,
        closeCart,
        isOpenCartModal,
        products,
        currentPage,
        totalPages,
        nextUrl,
        prevUrl,
        setCurrentPage,
        fetchProducts,
        waggons,
        setWaggons,
        origin, // Añadir aquí
        setOrigin, // Añadir aquí
        destination,
        setDestination,
        cash,
        setCash,
        
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                {isOpenCartModal && <CartModalView isOpen={isOpenCartModal} onClose={closeCart} origin={origin} destination={destination} cash={cash} />}
                {children}
            </div>
        </Context.Provider>
    );
};

export default ContextProvider;
