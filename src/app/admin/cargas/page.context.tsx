'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useState } from 'react';

const CreateLoadModal = dynamic(() => import('./modals/create-load-modal'));
const ConfirmLoadModal = dynamic(() => import('./modals/confirm-load-modal'));

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    operator: string;
    plate: string;
    load: string;
    last_service_date: string;
}

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    data: any[];
    createObject: () => void;
    confirmLoad: (loadData: any) => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({
    children,
}: ProviderProps) => {
    const data: DataObject[] = [
        {
            id: 1,
            operator: 'Braulio Nvarrete',
            plate: 'ABC-123',
            load: 'Carga 1',
            last_service_date: '2021-01-01',
        },
        {
            id: 2,
            operator: 'Alberto Nvarrete',
            plate: 'ABC-123',
            load: 'Carga 1',
            last_service_date: '2021-01-01',
        },
    ]

    // Inicializa loadData con un objeto vacío en lugar de null
    const [currentObject, setCurrentObject] = useState(null);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
    const [loadData, setLoadData] = useState({}); // Inicializa con un objeto vacío

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenConfirmModal(false);
    }, []);

    // Actualiza loadData con los datos del formulario correctamente
    const confirmLoad = (loadData: any) => {
        setLoadData(loadData); 
        setIsOpenCreateModal(false);
        setIsOpenConfirmModal(true);
    };

    const value = {
        data,
        createObject: () => {
            onCloseModals();
            setIsOpenCreateModal(true);
        },
        confirmLoad,
    };

    return (
        <Context.Provider
            value={value}
        >
            <div className='relative w-full h-full'>
                <CreateLoadModal isOpen={isOpenCreateModal} onClose={onCloseModals} confirmLoad={confirmLoad} />
                <ConfirmLoadModal isOpen={isOpenConfirmModal} onClose={onCloseModals} loadData={loadData} />
                {children}
            </div>
        </Context.Provider>
    );
};