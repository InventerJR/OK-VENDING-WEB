'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { listBrand, getCategories, listProducts } from '../../../../api_categories_products'; // Asegúrate de ajustar la ruta

const CreateProductModal = dynamic(() => import('./modals/create-product-modal'));
const DeleteProductModal = dynamic(() => import('./modals/delete-product-modal'));
const UpdateProductModal = dynamic(() => import('./modals/update-product-modal'));
const CreateBrandModal = dynamic(() => import('./modals/create-brand-modal'));

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    uuid: string;
    name: string;
    image?: string | null;
    brand: string;  // Asumamos que el brand es un string
    content?: string;
    sale_price?: number;
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
    selectedProduct: any;
    setSelectedProduct: (value: any) => void;
    data: DataObject[];
    nextUrl:string | null;
    prevUrl:string | null;
    brands: BrandDataObject[];
    categories: CategoryDataObject[];
    currentPage: number;
    totalPages: number;
    createObject: () => void;
    createBrandObject: () => void;
    editObject: (object: any) => void;
    deleteObject: (object: any) => void;
    refreshData: (url?: string) => void; // Agrega esta función
    refreshProductos: (url?: string) => void; // Agrega esta función
    setCurrentPage: (page: number) => void; // Agrega esta función
};

const Context = createContext<ContextInterface>({} as ContextInterface);

/**
 * to be used in components that are children of the Context Provider
 * @returns any
 */
export const usePageContext = () => useContext(Context);
export const TASKS_PER_PAGE = 10;
/** Context Provider Component **/
export const ContextProvider = ({
    children,
}: ProviderProps) => {

    const [data, setData] = useState<DataObject[]>([]);
    const [current_object, setCurrentObject] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenCreateBrandModal, setIsOpenCreateBrandModal] = useState(false);
    const [brands, setBrands] = useState<BrandDataObject[]>([]);
    const [categories, setCategories] = useState<CategoryDataObject[]>([]);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
        setIsOpenCreateBrandModal(false);
    }, []);

    const fetchData = useCallback(async (url?: string) => {
        try {
            const response = await listBrand(url);
            console.log("Fetched brands data:", response);
            setBrands(response.Brands);  // Ajusta el acceso a la propiedad correcta
            console.log("Set data:", response.Brands);  // Ajusta el acceso a la propiedad correcta
            setCurrentPage(response.current || 1);
            setTotalPages(Math.ceil(response.count / TASKS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);
        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    }, []);

    const fetchProductos = useCallback(async (url?: string) => {
        try {
            const response = await listProducts(url);
            console.log("Fetched products data:", response);
            setData(response.results || []);  // Ajusta el acceso a la propiedad correcta
            console.log("Set products:", response.results);  // Ajusta el acceso a la propiedad correcta
            setCurrentPage(response.current || 1);
            setTotalPages(Math.ceil(response.count / TASKS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await getCategories();
            console.log("Fetched categories data:", response);
            setCategories(response.categories || []);  // Ajusta el acceso a la propiedad correcta
            console.log("Set categories:", response.categories);  // Ajusta el acceso a la propiedad correcta
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
        fetchCategories();
        fetchProductos();
    }, [fetchData, fetchCategories, fetchProductos]);

    const value: ContextInterface = {
        data,
        selectedProduct,
        setSelectedProduct,
        brands,
        nextUrl,
        prevUrl,
        categories,
        currentPage,
        totalPages,
        setCurrentPage,
        createObject: () => {
            onCloseModals();
            setIsOpenCreateModal(true);
        },
        createBrandObject: () => {
            onCloseModals();
            setIsOpenCreateBrandModal(true);
        },
        editObject: (object: any) => {
            onCloseModals();
            setCurrentObject(object);
            setIsOpenUpdateModal(true);
        },
        deleteObject: (object: any) => {
            onCloseModals();
            setCurrentObject(object);
            setIsOpenDeleteModal(true);
        },
        refreshData: fetchData,
        refreshProductos: fetchProductos,
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                <CreateProductModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <DeleteProductModal isOpen={isOpenDeleteModal} onClose={onCloseModals} />
                <UpdateProductModal product={selectedProduct} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                <CreateBrandModal isOpen={isOpenCreateBrandModal} onClose={onCloseModals} />
                {children}
            </div>
        </Context.Provider>
    );
};
