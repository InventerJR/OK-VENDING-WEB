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
    id: number;
    category: string[];
    category_name: string;
    total_stock: number;
    supplier: SupplierObject;
    brand_name: string;
    brand_uuid: string;
    uuid: string;
    image: string;
    name: string;
    grammage: string;
    model: number;
    sale_price: string;
    id_code: string;
    package_quantity: number;
    brand: number;
    purchase_price: number;
    quantity: number;
    expiration: string;
};
export type SupplierObject = {
    id: number;
    uuid: string;
    name: string;
    address: string;
    image: string;
    phone: string;
    email: string;
    company: number;
};

interface ProviderProps {
    children?: React.ReactNode;
}

interface ContextInterface {
    products: StockDataObject[];
    categories: string[];
    suppliers: SupplierObject[];
    openCart: () => void;
    closeCart: () => void;
    isOpenCartModal: boolean;
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
    fetchProducts: () => Promise<void>;
    setFilters: (search: string, category: string, supplier: string) => void;
    fetchSuppliers: () => Promise<void>;
    updateObjectQuantity: (id: number, quantity: number) => void;
    updateProduct: (index: number, field: keyof StockDataObject, value: any) => void;
}

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({ children }: ProviderProps) => {
    const [allProducts, setAllProducts] = useState<StockDataObject[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<StockDataObject[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierObject[]>([]);
    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [supplier, setSupplier] = useState('');

    const fetchProducts = useCallback(async () => {
        try {
            const response = await getAllProducts(`${CONSTANTS.API_BASE_URL}/products/get_all_products/`);
            setAllProducts(response);
            const uniqueCategories = [...new Set(response.map((product: any) => product.category_name))];
            setCategories(uniqueCategories as string[]);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const filtered = allProducts.filter(product => 
            product.name.toLowerCase().includes(search.toLowerCase()) &&
            (category === '' || product.category_name === category) &&
            (supplier === '' || (product.supplier && product.supplier.name.includes(supplier)))
        );
        setFilteredProducts(filtered);
        setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    }, [allProducts, search, category, supplier]);

    const setFilters = useCallback((newSearch: string, newCategory: string, newSupplier: string) => {
        setSearch(newSearch);
        setCategory(newCategory);
        setSupplier(newSupplier);
        setCurrentPage(1);
    }, []);

    const fetchSuppliers = useCallback(async () => {
        try {
            const data = await getAllSuppliers();
            setSuppliers(data);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    }, []);

    const updateObjectQuantity = useCallback((id: number, quantity: number) => {
        setAllProducts(prevProducts => {
            const updatedProducts = prevProducts.map(product => {
                if (product.id === id) {
                    return { ...product, quantity };
                }
                return product;
            });
            localStorageWrapper.setItem('registeredProducts', JSON.stringify(updatedProducts));
            return updatedProducts;
        });
    }, []);

    const updateProduct = useCallback((index: number, field: keyof StockDataObject, value: any) => {
        setAllProducts(prevProducts => {
            const updatedProducts = [...prevProducts];
            (updatedProducts[index] as any)[field] = value;
            localStorageWrapper.setItem('registeredProducts', JSON.stringify(updatedProducts));
            return updatedProducts;
        });
    }, []);

    const openCart = useCallback(() => {
        setIsOpenCartModal(true);
    }, []);

    const closeCart = useCallback(() => {
        setIsOpenCartModal(false);
    }, []);

    const value = {
        products: filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
        categories,
        suppliers,
        openCart,
        closeCart,
        isOpenCartModal,
        currentPage,
        totalPages,
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