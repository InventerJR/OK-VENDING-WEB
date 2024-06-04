'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CreateProviderModal = dynamic(() => import('./modals/create-provider-modal'));
const DeleteProviderModal = dynamic(() => import('./modals/delete-provider-modal'));
const UpdateProviderModal = dynamic(() => import('./modals/update-provider-modal'));

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    name: string;
    image?: string|null;
    phone?: string;
    email?: string;
    address?: string;
}

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {

    selectedProvider: any;
    setSelectedProvider: (value: any) => void;
    provider: any[];
    createObject: () => void;
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

    const provider: DataObject[] = [
        {
            id: 1,
            name: 'Proveedor 1',
            image: null,
            phone: '1234567890',
            email: 'email1@com.com',
            address: 'address 1',
        },
        {
            id:2,
            name: 'Proveedor 2',
            image: null,
            phone: '1234567890',
            email: 'email2@com.com',
            address: 'address 2',
        },
        {
            id:3,
            name: 'Proveedor 3',
            image: null,
            phone: '1234567890',
            email: 'email2@com.com',
            address: 'address 2',
        },
        {
            id:4,
            name: 'Proveedor 4',
            image: null,
            phone: '1234567890',
            email: 'email2@com.com',
            address: 'address 2',
        },
        {
            id:5,
            name: 'Proveedor 5',
            image: null,
            phone: '1234567890',
            email: 'email2@com.com',
            address: 'address 2',
        },
        {
            id:6,
            name: 'Proveedor 6',
            image: null,
            phone: '1234567890',
            email: 'email2@com.com',
            address: 'address 2',
        },
        {
            id:7,
            name: 'Proveedor 7',
            image: null,
            phone: '1234567890',
            email: 'email2@com.com',
            address: 'address 2',
        },
        {
            id:8,
            name: 'Proveedor 8',
            image: null,
            phone: '1234567890',
            email: 'email2@com.com',
            address: 'address 2',
        },
    ]

    const [current_object, setCurrentObject] = useState(null);

    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(null);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const value = {
        selectedProvider,
        setSelectedProvider,
        provider,
        createObject: () => {
            onCloseModals();
            setIsOpenCreateModal(true);
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
                <CreateProviderModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <DeleteProviderModal isOpen={isOpenDeleteModal} onClose={onCloseModals} />
                <UpdateProviderModal provider={selectedProvider} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                {children}
            </div>
        </Context.Provider>
    );
};

