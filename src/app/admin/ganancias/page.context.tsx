'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getProfit } from '../../../../apiDono'; // Asegúrate de ajustar la ruta
import { CONSTANTS } from '@/constants';

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number; // Si no tienes un ID en la respuesta del servicio, podrías generar uno dinámicamente
    operator: string;
    machine_name: string;
    sale: number;
    cash_left: number;
    visit_date: string;
};

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    data: DataObject[];
    selectedDetail: DataObject | null;
    setSelectedDetail: (value: DataObject | null) => void;
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

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({ children }: ProviderProps) => {
    const [data, setData] = useState<DataObject[]>([]);
    const [selectedDetail, setSelectedDetail] = useState<DataObject | null>(null);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const fetchData = useCallback(async (url?: string) => {
        try {
            const response = await getProfit(url || CONSTANTS.API_BASE_URL + '/inventories/get_ganancia/');
            
            // Mapea los datos recibidos a la estructura de DataObject
            const mappedData = response.visits.map((item: any, index: number) => ({
                id: index + 1,  // Genera un ID dinámico si no tienes uno
                operator: item.operator,
                machine_name: item.machine_name,
                sale: item.sale,
                cash_left: item.cash_left,
                visit_date: item.visit_date,
            }));

            setData(mappedData);
            setCurrentPage(response.current || 1);
            setTotalPages(Math.ceil(response.count / ITEMS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);
        } catch (error) {
            console.error("Error fetching profits:", error);
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
        setSelectedDetail(object);
        setIsOpenUpdateModal(true);
    };

    const deleteObject = (object: DataObject) => {
        onCloseModals();
        setSelectedDetail(object);
        setIsOpenDeleteModal(true);
    };

    const value = {
        data,
        selectedDetail,
        setSelectedDetail,
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
                {/* Modales comentados para futura implementación */}
                {/* <CreateProviderModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <UpdateProviderModal provider={selectedDetail} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                <DeleteProviderModal provider={selectedDetail} isOpen={isOpenDeleteModal} onClose={onCloseModals} /> */}
                {children}
            </div>
        </Context.Provider>
    );
};

export default ContextProvider;
