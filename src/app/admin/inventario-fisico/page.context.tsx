'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getWarehousePlaceStockByUUID } from '../../../../api'; // Ajusta la ruta según sea necesario

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
    category_name: string;
    purchase_price: number;
    sale_price: number;
    stock: number;
    investment: number;
};

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    data: DataObject[];
    products: StockDataObject[];
    filteredProducts: StockDataObject[];
    categories: string[];
    fetchWaggonStock: (uuid: string) => Promise<void>;
    setCategoryFilter: (category: string) => void;
    createObject: () => void;
    editObject: (object: StockDataObject) => void;
    deleteObject: (object: StockDataObject) => void;
    openCart: () => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({ children }: ProviderProps) => {
    const [products, setProducts] = useState<StockDataObject[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<StockDataObject[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [currentObject, setCurrentObject] = useState<StockDataObject | null>(null);

    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenCartModal, setIsOpenCartModal] = useState(false);

    const data: DataObject[] = [
        {
            id: 1,
            name: 'Machine 1',
            type: 'Type 1',
            address: 'Address 1',
        },
        {
            id: 2,
            name: 'Machine 2',
            type: 'Type 2',
            address: 'Address 2',
        },
        {
            id: 3,
            name: 'Machine 3',
            type: 'Type 3',
            address: 'Address 3',
        },
    ];

    const fetchWaggonStock = useCallback(async (uuid: string) => {
        try {
            const waggonStockData = await getWarehousePlaceStockByUUID(uuid);
            const stockData = waggonStockData.stock.map((item: any) => ({
                id: item.product.id,
                name: item.product.name,
                image: item.product.image,
                category_name: item.product.category_name as string,
                purchase_price: item.product.purchase_price,
                sale_price: parseFloat(item.product.sale_price),
                stock: item.quantity,
                investment: item.quantity * parseFloat(item.product.sale_price),
            }));
            setProducts(stockData);
            setFilteredProducts(stockData);

            const uniqueCategories = [...new Set(stockData.map((item: { category_name: string }) => item.category_name))] as string[];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Error fetching waggon stock:", error);
        }
    }, []);

    useEffect(() => {
        const uuid = localStorage.getItem('selectedWarehousePlaceUUID');
        if (uuid) {
            fetchWaggonStock(uuid);
        }
    }, [fetchWaggonStock]);

    useEffect(() => {
        if (categoryFilter) {
            setFilteredProducts(products.filter(product => product.category_name === categoryFilter));
        } else {
            setFilteredProducts(products);
        }
    }, [categoryFilter, products]);

    const createObject = () => {
        onCloseModals();
        setIsOpenCreateModal(true);
    };

    const editObject = (object: StockDataObject) => {
        onCloseModals();
        setCurrentObject(object);
        setIsOpenUpdateModal(true);
    };

    const deleteObject = (object: StockDataObject) => {
        onCloseModals();
        setCurrentObject(object);
        setIsOpenDeleteModal(true);
    };

    const openCart = () => {
        console.log('open cart');
        setIsOpenCartModal(true);
    };

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const value: ContextInterface = {
        data,
        products,
        filteredProducts,
        categories,
        fetchWaggonStock,
        setCategoryFilter,
        createObject,
        editObject,
        deleteObject,
        openCart,
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                {children}
            </div>
        </Context.Provider>
    );
};

export default ContextProvider;
