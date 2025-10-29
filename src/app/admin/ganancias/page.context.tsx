'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getProfit, getCompanyMovements } from '../../../../api';
import { CONSTANTS } from '@/constants';
import CreateMovementModal from '../incidentes/modals/create-incident-modal';

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number; 
    type: 'ganancias' | 'incidentes'
    operator: string;
    machine_name: string;
    sale: number;
    cash_left: number;
    visit_date: string;
    // incidente
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
    data: DataObject[]; // Asegúrate de que el tipo sea DataObject[]
    selectedDetail: DataObject | null;
    setSelectedDetail: (value: DataObject | null) => void;
    createObject: () => void;
    editObject: (object: DataObject) => void;
    deleteObject: (object: DataObject) => void;
    refreshData: (url?: string, type?: 'ganancias' | 'incidentes') => void;
    currentPage: number;
    totalPages: number;
    nextUrl: string | null;
    prevUrl: string | null;
    currentType: 'ganancias' | 'incidentes';
    isLoading: boolean;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({ children }: ProviderProps) => {
    const [data, setData] = useState<DataObject[]>([]); // Inicializa con un array vacío
    const [selectedDetail, setSelectedDetail] = useState<DataObject | null>(null);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [currentType, setCurrentType] = useState< 'ganancias' | 'incidentes' >('ganancias');

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const fetchData = useCallback(async (url?: string, type?: 'ganancias' | 'incidentes') => {
        setIsLoading(true)
        try {
            let response, dataArray;

            if (type === 'ganancias') {
                response = await getProfit(url || CONSTANTS.API_BASE_URL + '/inventories/get_ganancia/');
                dataArray = response.visits.map((item: any, index: number) => ({
                    id: index + 1,
                    type: 'ganancias',
                    operator: item.operator,
                    machine_name: item.machine_name,
                    sale: item.sale,
                    cash_left: item.cash_left,
                    visit_date: item.visit_date,
                }));
                setCurrentType('ganancias');
            } else if (type === 'incidentes') {
                response = await getCompanyMovements(url);
                dataArray = response.results.map((item: any, index: number) => ({
                    id: index + 1,
                    type: 'incidentes',
                    movement_type: item.movement_type,
                    incoming: item.incoming,
                    outgoing: item.outgoing,
                    dispatcher: item.dispatcher,
                    date: item.date,
                }));
                setCurrentType('incidentes');
            }

            setData(dataArray);
            setCurrentPage(response.current || 1);
            setTotalPages(Math.ceil(response.count / ITEMS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);
            // console.log('Data', data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false)
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
        currentType,
        isLoading 
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                {/* Modales comentados para futura implementación */}
                {/* <CreateProviderModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <UpdateProviderModal provider={selectedDetail} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                <DeleteProviderModal provider={selectedDetail} isOpen={isOpenDeleteModal} onClose={onCloseModals} /> */}
                <CreateMovementModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                {children}
            </div>
        </Context.Provider>
    );
};

export default ContextProvider;