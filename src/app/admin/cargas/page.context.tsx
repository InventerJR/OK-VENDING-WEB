'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getWarehousePlaces, getWarehouseWaggons, getProductStockByUUID, getProducts } from '../../../../api';
import { CONSTANTS } from '@/constants';

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
    uuid: string; // Agrega el uuid al tipo de dato
};

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    warehouses: any[];
    categories: string[];
    suppliers: string[];
    fetchProductsByOrigin: (origin: string) => Promise<void>;
    fetchAllWaggons: () => Promise<any>;
    setFilters: (search: string, category: string, supplier: string) => void;
    products: StockDataObject[];
    currentPage: number;
    totalPages: number;
    nextUrl: string | null;
    prevUrl: string | null;
    setCurrentPage: (page: number) => void;
    fetchProducts: (url?: string) => void;
    waggons: any[];
    setWaggons: React.Dispatch<React.SetStateAction<any[]>>;
    origin: string;
    setOrigin: (origin: string) => void;
    destination: string;
    setDestination: (destination: string) => void;
    cash: string;
    setCash: (cash: string) => void;
    quantities: { [key: string]: number };
    setQuantities: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({ children }: ProviderProps) => {
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [suppliers, setSuppliers] = useState<string[]>([]);
    const [products, setProducts] = useState<StockDataObject[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [supplier, setSupplier] = useState('');
    const [waggons, setWaggons] = useState<any[]>([]);
    const [origin, _setOrigin] = useState('');
    const [destination, _setDestination] = useState<string>('');
    const [cash, _setCash] = useState<string>('');
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

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

    const isValidUUID = (uuid: string) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regex.test(uuid);
    };

    const setOrigin = (origin: string) => {
        if (!isValidUUID(origin)) {
            console.error("Invalid UUID for origin:", origin);
            return;
        }
        _setOrigin(origin);
        fetchProductsByOrigin(origin);
    };

    const setDestination = (destination: string) => {
        if (!isValidUUID(destination)) {
            console.error("Invalid UUID for destination:", destination);
            return;
        }
        _setDestination(destination);
    };

    const setCash = (cash: string) => {
        _setCash(cash);
    };

    const fetchProductsByOrigin = async (origin: string) => {
        try {
            const response = await getProductStockByUUID(origin);
            setProducts(response.stock);
        } catch (error) {
            console.error('Error fetching products by origin:', error);
        }
    };

    useEffect(() => {
        if (origin) {
            fetchProductsByOrigin(origin);
        }
    }, [origin]);

    const fetchAllWaggons = async () => {
        try {
            const response = await getWarehouseWaggons();
            setWaggons(response.results);
        } catch (error) {
            console.error('Error fetching waggons:', error);
            setWaggons([]);
        }
    };

    const fetchProducts = useCallback(async (url?: string) => {
        try {
            const query = new URLSearchParams();
            if (search) query.set('search', search);
            if (category) query.set('category_name', category);
            if (supplier) query.set('supplier', supplier);
            const fetchUrl = url || `${CONSTANTS.API_BASE_URL}/products/get_products/${query.toString() ? `?${query.toString()}` : ''}`;
            const response = await getProducts(fetchUrl);
            setProducts(response.results);
            setCurrentPage(response.current || 1);
            setTotalPages(Math.ceil(response.count / ITEMS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);

            const uniqueCategories = [...new Set(response.results.map((product: any) => product?.category_name).filter(Boolean))];
            const uniqueSuppliers = [...new Set(response.results.map((product: any) => product?.supplier?.name).filter(Boolean))];
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

    const value = {
        warehouses,
        categories,
        suppliers,
        fetchAllWaggons,
        setFilters,
        products,
        currentPage,
        totalPages,
        nextUrl,
        prevUrl,
        setCurrentPage,
        fetchProducts,
        waggons,
        setWaggons,
        origin,
        setOrigin,
        destination,
        setDestination,
        cash,
        setCash, 
        quantities,
        setQuantities,
        fetchProductsByOrigin,
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;
