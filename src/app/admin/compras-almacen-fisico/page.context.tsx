import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getAllProducts, getAllSuppliers } from '../../../../api';
import { CONSTANTS } from '@/constants'
import { localStorageWrapper } from '@/utils/localStorageWrapper';

const CartModalView = dynamic(() => import('./cart/cart-modal'), { ssr: false });

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    name: string;
    type: string;
    address: string;
}

export type StockDataObject = {
    total_stock: number;
    clasification: string;
    provider: string;
    package_quantity: number;
    expiration: any;
    id: number;
    uuid: string;
    name: string;
    image: string;
    purchase_price: number;
    sale_price: number;
    stock: number;
    investment: number;
    quantity: number;
}

export type SupplierObject = {
    id: number;
    name: string;
    uuid: string;
};

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    products: StockDataObject[];
    categories: string[];
    suppliers: SupplierObject[];
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
    fetchSuppliers: () => void;
    updateObjectQuantity: (id: number, quantity: number) => void;
    updateProduct: (index: number, field: keyof StockDataObject, value: any) => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({ children }: ProviderProps) => {
    const [products, setProducts] = useState<StockDataObject[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierObject[]>([]);
    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [supplier, setSupplier] = useState('');

    // Cargar productos desde localStorage si existen
    useEffect(() => {
        const storedProducts = JSON.parse(localStorageWrapper.getItem('registeredProducts') || '[]');
        if (storedProducts.length > 0) {
            setProducts(storedProducts);
        }
    }, []);

    const fetchProducts = useCallback(async (url?: string) => {
        try {
            const query = new URLSearchParams();
            if (search) query.set('search', search);
            if (category) query.set('category_name', category);
            if (supplier) query.set('supplier', supplier);
            const fetchUrl = url || CONSTANTS.API_BASE_URL + `/products/get_products/?${query.toString()}`;
            const response = await getAllProducts(fetchUrl);
            
            // Combinar los productos recuperados con los datos de localStorage
            const storedProducts = JSON.parse(localStorageWrapper.getItem('registeredProducts') || '[]');
            const mergedProducts = response.results.map((product: StockDataObject) => {
                const storedProduct = storedProducts.find((sp: StockDataObject) => sp.id === product.id);
                return storedProduct ? { ...product, ...storedProduct } : product;
            });

            setProducts(mergedProducts);
            setCurrentPage(response.current || 1);
            setTotalPages(Math.ceil(response.count / ITEMS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);

            const uniqueCategories = [...new Set(response.results.map((product: any) => product.category_name))];
            setCategories(uniqueCategories as string[]);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, [search, category, supplier]);

    const setFilters = (search: string, category: string, supplier: string) => {
        setSearch(search);
        setCategory(category);
        setSupplier(supplier);
    };

    const fetchSuppliers = async () => {
        try {
            const data = await getAllSuppliers();
            setSuppliers(data);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
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

    const updateProduct = (index: number, field: keyof StockDataObject, value: any) => {
        const updatedProducts = [...products];
        //@ts-ignore
        updatedProducts[index][field] = value;
        setProducts(updatedProducts);
        localStorageWrapper.setItem('registeredProducts', JSON.stringify(updatedProducts));
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
        setFilters,
        updateProduct,
        updateObjectQuantity,
        fetchSuppliers,
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
