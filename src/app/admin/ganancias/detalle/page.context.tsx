'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    name: string;
    operator: string;
    sales: number;
    total_amount: number;
    last_visit_date: string;
}

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    data: DataObject[];
    createObject: () => void;
    editObject: (object: DataObject) => void;
    deleteObject: (object: DataObject) => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({ children }: ProviderProps) => {
    const data: DataObject[] = [
        {
            id: 1,
            name: 'Maquina 1',
            operator: 'Donovan Lara',
            sales: 2500,
            total_amount: 300,
            last_visit_date: '2021-10-10',
        },
        {
            id: 2,
            name: 'Maquina 2',
            operator: 'Braulio Alejandro',
            sales: 1600,
            total_amount: 5000,
            last_visit_date: '2021-10-10',
        },
        {
            id: 3,
            name: 'Maquina 3',
            operator: 'Alberto Juarez',
            sales: 1600,
            total_amount: 100,
            last_visit_date: '2021-10-10',
        },
    ];

    const [currentObject, setCurrentObject] = useState<DataObject | null>(null);

    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const value = {
        data,
        createObject: () => {
            onCloseModals();
            setIsOpenCreateModal(true);
        },
        editObject: (object: DataObject) => {
            onCloseModals();
            setCurrentObject(object);
            setIsOpenUpdateModal(true);
        },
        deleteObject: (object: DataObject) => {
            onCloseModals();
            setCurrentObject(object);
            setIsOpenDeleteModal(true);
        },
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full h-full'>
                {children}
            </div>
        </Context.Provider>
    );
};
