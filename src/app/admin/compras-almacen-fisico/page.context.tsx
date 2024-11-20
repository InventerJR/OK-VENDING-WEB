import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAllProducts, getAllSuppliers, getWarehousePlaceStockByUUID } from '../../../../api';
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
    stock: number;
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
    warehouseStock: { [productUuid: string]: number }; // Mapeo de productos a stock.
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
    isNewWarehouse: boolean; 
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
    const [warehouseStock, setWarehouseStock] = useState<{ [productUuid: string]: number }>({});
    // Dentro de tu ContextProvider
    const [selectedWarehouse, setSelectedWarehouse] = useState<string>('');
    const [isNewWarehouse, setIsNewWarehouse] = useState<boolean>(false);   

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

    const fetchWarehouseStock = useCallback(async (uuid: string) => {
        try {
            const warehouseStockData = await getWarehousePlaceStockByUUID(uuid);
            const stockMap: { [productUuid: string]: number } = {};
            let allStockIsZero = true;
    
            warehouseStockData.stock.forEach((item: any) => {
                stockMap[item.product.uuid] = item.quantity;
                if (item.quantity > 0) {
                    allStockIsZero = false;
                }
            });
    
            setWarehouseStock(stockMap);
            setIsNewWarehouse(allStockIsZero); // Establecemos si el almacén es nuevo
        } catch (error) {
            console.error("Error fetching warehouse stock:", error);
        }
    }, []);
    

    useEffect(() => {
        const warehouseUUID = localStorageWrapper.getItem('selectedWarehousePlaceUUID');
        if (warehouseUUID) {
            fetchWarehouseStock(warehouseUUID);  // Asegura cargar el inventario del almacén correcto
        }
    }, [fetchWarehouseStock]);

    useEffect(() => {
        if (selectedWarehouse) {
            fetchWarehouseStock(selectedWarehouse);
        }
    }, [selectedWarehouse, fetchWarehouseStock]);


    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const mergedProducts = allProducts.map((product) => {
            const stock = warehouseStock[product.uuid] || 0; // Aquí tomas el stock del almacén
            return { ...product, stock }; // Usas el stock como parte del producto
        });
    
        const filtered = mergedProducts.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase()) &&
            (category === '' || product.category_name === category) &&
            (supplier === '' || (product.supplier && product.supplier.name.includes(supplier)))
        );
    
        setFilteredProducts(filtered);
        setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    }, [allProducts, warehouseStock, search, category, supplier]);


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

    useEffect(() => {
        if (selectedWarehouse) {
            fetchSuppliers();
        }
    }, [selectedWarehouse, fetchSuppliers]);

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
        warehouseStock, // Aquí el mapeo por UUID con cantidades
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
        isNewWarehouse, 
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