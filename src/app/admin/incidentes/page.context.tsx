'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CreateIncidentModal = dynamic(() => import('./modals/create-incident-modal'));
const DeleteIncidentModal = dynamic(() => import('./modals/delete-incident-modal'));
const UpdateIncidentModal = dynamic(() => import('./modals/update-incident-modal'));

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    name: string;
}

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {

    data: any[];

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

    const data: DataObject[] = [
        {
            id: 1,
            name: 'Categoría 1',
        },
    ]

    const [current_object, setCurrentObject] = useState(null);

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
            <div className='relative w-full h-full'>
                <CreateIncidentModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <DeleteIncidentModal isOpen={isOpenDeleteModal} onClose={onCloseModals} />
                <UpdateIncidentModal isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                {children}
            </div>
        </Context.Provider>
    );
};
