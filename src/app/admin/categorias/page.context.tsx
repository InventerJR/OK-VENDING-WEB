'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CreateCategoryModal = dynamic(() => import('./modals/create-category-modal'));
const DeleteCategoryModal = dynamic(() => import('./modals/delete-category-modal'));
const UpdateCategoryModal = dynamic(() => import('./modals/update-category-modal'));

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    name: string;
}

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {

    selectedCategory: any;
    setSelectedCategory: (value: any) => void;
    category: any[];
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
export const ContextCategory = ({
    children,
}: ProviderProps) => {

    const category: DataObject[] = [
        {
            id: 1,
            name: 'Categoría 1',
        },
        {
            id: 2,
            name: 'Categoría 2',
        },
        {
            id: 3,
            name: 'Categoría 3',
        },
        {
            id: 4,
            name: 'Categoría 4',
        },
        {
            id: 5,
            name: 'Categoría 5',
        },
        {
            id: 6,
            name: 'Categoría 6',
        },
    ]

    const [current_object, setCurrentObject] = useState(null);

    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const value = {
        selectedCategory,
        setSelectedCategory,// se declaran dentro de value de selectUser y setSelectedUser
        category,
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
                <CreateCategoryModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <DeleteCategoryModal isOpen={isOpenDeleteModal} onClose={onCloseModals} />
                <UpdateCategoryModal category={selectedCategory} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                {children}
            </div>
        </Context.Provider>
    );
};
