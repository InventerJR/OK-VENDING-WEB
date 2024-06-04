'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CreateProductModal = dynamic(() => import('./modals/create-product-modal'));
const DeleteProductModal = dynamic(() => import('./modals/delete-product-modal'));
const UpdateProductModal = dynamic(() => import('./modals/update-product-modal'));
const CreateBrandModal = dynamic(() => import('./modals/create-brand-modal'));

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    name: string;
    image?: string|null;
    brand: number;
    content?: string;
    sale_price?: number;
}

export type BrandDataObject = {
    id: number;
    name: string;
}

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {

    selectedProduct: any;
    setSelectedProduct: (value: any) => void;
    data: any[];
    brands: any[];
    createObject: () => void;
    createBrandObject: () => void;
    editObject: (object:any) => void;
    deleteObject: (object:any) => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

/**
 * to be used in components that are children of the Context Provider
 * @returns any
 */
export const usePageContext = () => useContext(Context);


/** Context Provider Component **/
export const ContextProvider = ({
    children,
}: ProviderProps) => {

    const data: DataObject[] = [
        {
            id: 1,
            name: 'Producto 1',
            brand: 1,
            content: 'Lata 500ml',
            sale_price: 20,
        },
        {
            id: 2,
            name: 'Producto 2',
            brand: 2,
            content: 'Lata 500ml',
            sale_price: 20,
        },
        {
            id: 3,
            name: 'Producto 3',
            brand: 3,
            content: 'Lata 500ml',
            sale_price: 20,
        },
    ]

    const marcaDataObject: BrandDataObject[] = [
        {
            id: 1,
            name: 'Marca 11',
        },
        {
            id: 2,
            name: 'Marca 22',
        },
        {
            id: 3,
            name: 'Marca 33',
        },
    ]

    const [current_object, setCurrentObject] = useState(null);

    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isOpenCreateBrandModal, setIsOpenCreateBrandModal] = useState(false);
    const [brands, setBrands] = useState(marcaDataObject);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
        setIsOpenCreateBrandModal(false);
    }, []);

    const value = {
        data,
        selectedProduct,
        setSelectedProduct,
        brands,
        createObject: () => {
            onCloseModals();
            setIsOpenCreateModal(true);
        },
        createBrandObject: () => {
            onCloseModals();
            setIsOpenCreateBrandModal(true);
        },
        editObject: (object:any) => {
            onCloseModals();
            setCurrentObject(object);
            setIsOpenUpdateModal(true);
        },
        deleteObject: (object:any) => {
            onCloseModals();
            setCurrentObject(object);
            setIsOpenDeleteModal(true);
        }
    };

    return (
        <Context.Provider
            value={value}
        >
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
