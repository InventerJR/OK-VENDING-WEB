'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getSuppliers } from '../../../../apiDono'; // Asegúrate de ajustar la ruta
import { CONSTANTS } from '@/constants';

const CreateProviderModal = dynamic(() => import('./modals/create-provider-modal'));
const DeleteProviderModal = dynamic(() => import('./modals/delete-provider-modal'));
const UpdateProviderModal = dynamic(() => import('./modals/update-provider-modal'));

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    uuid: string;
    name: string;
    image: string | null;
    phone: string;
    email: string;
    address: string;
}

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    providers: DataObject[];
    allProviders: DataObject[];
    selectedProvider: DataObject | null;
    setSelectedProvider: (value: DataObject | null) => void;
    createObject: (object: DataObject) => void;
    editObject: (object: DataObject) => void;
    deleteObject: (object: DataObject) => void;
    refreshData: (url?: string) => void;
    currentPage: number;
    totalPages: number;
    nextUrl: string | null;
    prevUrl: string | null;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({ children }: ProviderProps) => {
    const [providers, setProviders] = useState<DataObject[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<DataObject | null>(null);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [allProviders, setAllProviders] = useState<DataObject[]>([]); // Nuevo estado para todos los proveedores

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const fetchAllProviders = useCallback(async () => {
        try {
            let url = CONSTANTS.API_BASE_URL + '/suppliers/get_suppliers';
            let results: DataObject[] = [];
            while (url) {
                const response = await getSuppliers(url);
                results = [...results, ...response.results];
                url = response.next; // Siguiente página
            }
            setAllProviders(results); // Guarda todos los proveedores
        } catch (error) {
            console.error("Error fetching all suppliers:", error);
        }
    }, []);

    const extractPageNumber = (url: string | null) => {
        if (!url) return 1; // Si no hay URL, es la primera página
        const params = new URLSearchParams(url.split('?')[1]);
        return parseInt(params.get('page') || '1', 10);
    };

    const fetchData = useCallback(async (url?: string) => {
        try {
            const response = await getSuppliers(url || CONSTANTS.API_BASE_URL + '/suppliers/get_suppliers');
            setProviders(response.results);
            const currentPageNumber = extractPageNumber(url || CONSTANTS.API_BASE_URL + '/suppliers/get_suppliers');
            setCurrentPage(currentPageNumber);
            setTotalPages(Math.ceil(response.count / ITEMS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    }, []);

    useEffect(() => {
        fetchAllProviders();
        fetchData();
    }, [fetchData]);

    const createObject = () => {
        onCloseModals();
        setIsOpenCreateModal(true);
    };

    const editObject = (object: DataObject) => {
        onCloseModals();
        setSelectedProvider(object);
        setIsOpenUpdateModal(true);
    };

    const deleteObject = (object: DataObject) => {
        onCloseModals();
        setSelectedProvider(object);
        setIsOpenDeleteModal(true);
    };

    const value = {
        providers,
        allProviders,
        selectedProvider,
        setSelectedProvider,
        createObject,
        editObject,
        deleteObject,
        refreshData: fetchData,
        currentPage,
        totalPages,
        nextUrl,
        prevUrl,
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                <CreateProviderModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <UpdateProviderModal provider={selectedProvider} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                <DeleteProviderModal provider={selectedProvider} isOpen={isOpenDeleteModal} onClose={onCloseModals} />
                {children}
            </div>
        </Context.Provider>
    );
};

export default ContextProvider;
