import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getWarehousePlaceStockByUUID } from '../../../../api'; // Ajusta la ruta según sea necesario

interface ProviderProps {
    children?: React.ReactNode;
}

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

type ContextInterface = {
    products: StockDataObject[];
    filteredProducts: StockDataObject[];
    categories: string[];
    fetchWaggonStock: (uuid: string) => Promise<void>;
    setCategoryFilter: (category: string) => void;
    editObject: (object: StockDataObject) => void;
    deleteObject: (object: StockDataObject) => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({ children }: ProviderProps) => {
    const [products, setProducts] = useState<StockDataObject[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<StockDataObject[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string>('');

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

    const editObject = (object: StockDataObject) => {
        // Implement your edit logic here
    };

    const deleteObject = (object: StockDataObject) => {
        // Implement your delete logic here
    };

    const value: ContextInterface = {
        products,
        filteredProducts,
        categories,
        fetchWaggonStock,
        setCategoryFilter,
        editObject,
        deleteObject,
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
