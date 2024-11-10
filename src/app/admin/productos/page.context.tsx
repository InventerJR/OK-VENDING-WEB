'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { listBrand, getCategories, listProducts, getProductByUUID } from '../../../../api_categories_products';

const CreateProductModal = dynamic(() => import('./modals/create-product-modal'));
const DeleteProductModal = dynamic(() => import('./modals/delete-product-modal'));
const UpdateProductModal = dynamic(() => import('./modals/update-product-modal'));
const CreateBrandModal = dynamic(() => import('./modals/create-brand-modal'));
const DeleteBrandModal = dynamic(() => import('./modals/delete-brand-modal'));

export const ITEMS_PER_PAGE = 5;

export type DataObject = {
    id: number;
    uuid: string;
    name: string;
    image?: string | null;
    brand: string | null;
    content?: string;
    sale_price?: number;
    brand_uuid: string | null;
    category_uuid: string;
    grammage: number;
    id_code: string;
    model: string;
    package_quantity: number;
    purchase_price: number;
}

export type BrandDataObject = {
    id: number;
    uuid: string;
    name: string;
}

export type CategoryDataObject = {
    id: number;
    uuid: string;
    name: string;
}

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    data: DataObject[];
    brands: BrandDataObject[];
    categories: CategoryDataObject[];
    selectedProduct: any;
    setSelectedProduct: (value: any) => void;
    selectedBrand: any;
    setSelectedBrand: (value: any) => void;
    createObject: () => void;
    createBrandObject: () => void;
    editObject: (uuid: string) => void;
    deleteObject: (object: any) => void;
    deleteBrand: (object: any) => void;
    refreshData: (url?: string) => void;
    refreshProductos: (url?: string) => void;
    updateProductData: (updatedProduct: DataObject) => void;
    setIsOpenUpdateModal: (value: boolean) => void;
    currentPageProducts: number;
    totalPagesProducts: number;
    nextUrlProducts: string | null;
    prevUrlProducts: string | null;
    setCurrentPageProducts: (page: number) => void;
    currentPageBrands: number;
    totalPagesBrands: number;
    nextUrlBrands: string | null;
    prevUrlBrands: string | null;
    setCurrentPageBrands: (page: number) => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({
    children,
}: ProviderProps) => {
    const [data, setData] = useState<DataObject[]>([]);
    const [brands, setBrands] = useState<BrandDataObject[]>([]);
    const [categories, setCategories] = useState<CategoryDataObject[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<DataObject | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<BrandDataObject | null>(null);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenCreateBrandModal, setIsOpenCreateBrandModal] = useState(false);
    const [isOpenDeleteBrandModal, setIsOpenDeleteBrandModal] = useState(false);
    const [currentPageProducts, setCurrentPageProducts] = useState(1);
    const [totalPagesProducts, setTotalPagesProducts] = useState(0);
    const [nextUrlProducts, setNextUrlProducts] = useState<string | null>(null);
    const [prevUrlProducts, setPrevUrlProducts] = useState<string | null>(null);
    const [currentPageBrands, setCurrentPageBrands] = useState(1);
    const [totalPagesBrands, setTotalPagesBrands] = useState(0);
    const [nextUrlBrands, setNextUrlBrands] = useState<string | null>(null);
    const [prevUrlBrands, setPrevUrlBrands] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredData, setFilteredData] = useState<DataObject[]>([]);
    const [productSearchTerm, setProductSearchTerm] = useState<string>('');

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
        setIsOpenCreateBrandModal(false);
        setIsOpenDeleteBrandModal(false);
    }, []);

    const fetchData = useCallback(async (url?: string) => {
        setIsLoading(true);
        try {
            const response = await listBrand(url);
            setBrands(response.Brands);
            setCurrentPageBrands(response.current || 1);
            setTotalPagesBrands(Math.ceil(response.count / ITEMS_PER_PAGE));
            setNextUrlBrands(response.next);
            setPrevUrlBrands(response.previous);
        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    }, []);

    const fetchProductos = useCallback(async (url?: string) => {
        setIsLoading(true);
        try {
          const response = await listProducts(url);
          setData(response.results);
          setCurrentPageProducts(response.current || 1);
          setTotalPagesProducts(Math.ceil(response.count / ITEMS_PER_PAGE));
          setNextUrlProducts(response.next);
          setPrevUrlProducts(response.previous);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      }, []);
    
      useEffect(() => {
        fetchProductos();
      }, [fetchProductos]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await getCategories();
            setCategories(response.categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    const updateProductData = useCallback((updatedProduct: DataObject) => {
        setData((prevData) => 
            prevData.map((product) => 
                product.uuid === updatedProduct.uuid ? updatedProduct : product
            )
        );
    }, []);

    const openUpdateModal = useCallback(async (uuid: string) => {
        const product = await getProductByUUID(uuid);
        setSelectedProduct(product);
        setIsOpenUpdateModal(true);
    }, []);

    useEffect(() => {
        fetchData();
        fetchCategories();
        fetchProductos();
    }, [fetchData, fetchCategories, fetchProductos]);

    const value: ContextInterface = {
        data,
        brands,
        categories,
        selectedProduct,
        setSelectedProduct,
        selectedBrand,
        setSelectedBrand,
        createObject: () => {
            onCloseModals();
            setIsOpenCreateModal(true);
        },
        createBrandObject: () => {
            onCloseModals();
            setIsOpenCreateBrandModal(true);
        },
        editObject: (uuid: string) => {
            onCloseModals();
            openUpdateModal(uuid);
        },
        deleteObject: (object: any) => {
            onCloseModals();
            setSelectedProduct(object);
            setIsOpenDeleteModal(true);
        },
        deleteBrand: (object: any) => {
            onCloseModals();
            setSelectedBrand(object);
            setIsOpenDeleteBrandModal(true);
        },
        refreshData: fetchData,
        refreshProductos: fetchProductos,
        updateProductData,
        currentPageProducts,
        totalPagesProducts,
        nextUrlProducts,
        prevUrlProducts,
        setCurrentPageProducts,
        currentPageBrands,
        totalPagesBrands,
        nextUrlBrands,
        prevUrlBrands,
        setCurrentPageBrands,
        setIsOpenUpdateModal,
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                <CreateProductModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <DeleteProductModal isOpen={isOpenDeleteModal} onClose={onCloseModals} product={selectedProduct} />
                <UpdateProductModal product={selectedProduct} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                <CreateBrandModal isOpen={isOpenCreateBrandModal} onClose={onCloseModals} />
                <DeleteBrandModal isOpen={isOpenDeleteBrandModal} onClose={onCloseModals} brand={selectedBrand} />
                {children}
            </div>
        </Context.Provider>
    );
};

export default ContextProvider;