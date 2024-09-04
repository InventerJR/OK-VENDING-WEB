'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getCompanyMovements } from '../../../../api'; // Asegúrate de ajustar la ruta

const CreateMovementModal = dynamic(() => import('./modals/create-incident-modal'));

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    movement_type: string;
    incoming: string;
    outgoing: string;
    dispatcher: string;
    date: string;
};

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    data: DataObject[];
    createObject: () => void;
    editObject: (object: DataObject) => void;
    deleteObject: (object: DataObject) => void;
    refreshData: (url?: string) => void;
    currentPage: number;
    totalPages: number;
    nextUrl: string | null;
    prevUrl: string | null;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useIncidentPageContext = () => useContext(Context);

export const ContextProvider = ({
    children,
}: ProviderProps) => {
    const [data, setData] = useState<DataObject[]>([]);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [currentObject, setCurrentObject] = useState<DataObject | null>(null);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const fetchData = useCallback(async (url?: string) => {
        try {
            const response = await getCompanyMovements(url);
            setData(response.results);
            setCurrentPage(response.current || 1);
            setTotalPages(Math.ceil(response.count / ITEMS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);
        } catch (error) {
            console.error("Error fetching company movements:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const createObject = () => {
        onCloseModals();
        setIsOpenCreateModal(true);
    };

    const editObject = (object: DataObject) => {
        onCloseModals();
        setCurrentObject(object);
        setIsOpenUpdateModal(true);
    };

    const deleteObject = (object: DataObject) => {
        onCloseModals();
        setCurrentObject(object);
        setIsOpenDeleteModal(true);
    };

    const value = {
        data,
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
            <div className='relative w-full h-full'>
                <CreateMovementModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                {children}
            </div>
        </Context.Provider>
    );
};

export default ContextProvider;
