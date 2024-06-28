'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { listBrand, getCategories, listProducts } from '../../../../api_categories_products';

const CreateProductModal = dynamic(() => import('./modals/create-product-modal'));
const DeleteProductModal = dynamic(() => import('./modals/delete-product-modal'));
const UpdateProductModal = dynamic(() => import('./modals/update-product-modal'));
const CreateBrandModal = dynamic(() => import('./modals/create-brand-modal'));
const DeleteBrandModal = dynamic(() => import('./modals/delete-brand-modal')); // Importa el nuevo modal

export const ITEMS_PER_PAGE = 5;

export type DataObject = {
    id: number;
    uuid: string;
    name: string;
    image?: string | null;
    brand: string | null;
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
    data: DataObject[];
    brands: BrandDataObject[];
    categories: CategoryDataObject[];
    selectedProduct: any;
    setSelectedProduct: (value: any) => void;
    selectedBrand: any;
    setSelectedBrand: (value: any) => void;
    createObject: () => void;
    createBrandObject: () => void;
    editObject: (object: any) => void;
    deleteObject: (object: any) => void;
    deleteBrand: (object: any) => void;
    refreshData: (url?: string) => void;
    refreshProductos: (url?: string) => void;
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
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null); // Estado para la marca seleccionada
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [isOpenCreateBrandModal, setIsOpenCreateBrandModal] = useState(false);
    const [isOpenDeleteBrandModal, setIsOpenDeleteBrandModal] = useState(false); // Estado para el nuevo modal
    const [currentPageProducts, setCurrentPageProducts] = useState(1);
    const [totalPagesProducts, setTotalPagesProducts] = useState(0);
    const [nextUrlProducts, setNextUrlProducts] = useState<string | null>(null);
    const [prevUrlProducts, setPrevUrlProducts] = useState<string | null>(null);
    const [currentPageBrands, setCurrentPageBrands] = useState(1);
    const [totalPagesBrands, setTotalPagesBrands] = useState(0);
    const [nextUrlBrands, setNextUrlBrands] = useState<string | null>(null);
    const [prevUrlBrands, setPrevUrlBrands] = useState<string | null>(null);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
        setIsOpenCreateBrandModal(false);
        setIsOpenDeleteBrandModal(false); // Cierra el nuevo modal
    }, []);

    const fetchData = useCallback(async (url?: string) => {
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
        try {
            const response = await listProducts(url);
            setData(response.results);
            setCurrentPageProducts(response.current || 1);
            setTotalPagesProducts(Math.ceil(response.count / ITEMS_PER_PAGE));
            setNextUrlProducts(response.next);
            setPrevUrlProducts(response.previous);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await getCategories();
            setCategories(response.categories);
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
        brands,
        categories,
        selectedProduct,
        setSelectedProduct,
        selectedBrand, // Proveer el estado de la marca seleccionada
        setSelectedBrand, // Proveer el setter para la marca seleccionada
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
            setSelectedProduct(object);
            setIsOpenUpdateModal(true);
        },
        deleteObject: (object: any) => {
            onCloseModals();
            setSelectedProduct(object);
            setIsOpenDeleteModal(true);
        },
        deleteBrand: (object: any) => { // Método para borrar marca
            onCloseModals();
            setSelectedBrand(object);
            setIsOpenDeleteBrandModal(true);
        },
        refreshData: fetchData,
        refreshProductos: fetchProductos,
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
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                <CreateProductModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <DeleteProductModal isOpen={isOpenDeleteModal} onClose={onCloseModals} product={selectedProduct} /> {/* Actualiza el modal de eliminación de productos */}
                <UpdateProductModal product={selectedProduct} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                <CreateBrandModal isOpen={isOpenCreateBrandModal} onClose={onCloseModals} />
                <DeleteBrandModal isOpen={isOpenDeleteBrandModal} onClose={onCloseModals} brand={selectedBrand} /> {/* Nuevo modal para eliminar marcas */}
                {children}
            </div>
        </Context.Provider>
    );
};

export default ContextProvider;
