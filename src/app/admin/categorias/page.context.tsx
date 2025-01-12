import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory } from '../../../../api_categories_products'; // Asegúrate de ajustar la ruta

const CreateCategory = dynamic(() => import('./modals/create-category-modal'));
const UpdateCategory = dynamic(() => import('./modals/update-category-modal'));
const DeleteCategory = dynamic(() => import('./modals/delete-category-modal'));
export const TASKS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    uuid: string;
    name: string;
    description: string;
};

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    data: DataObject[];
    selectedCategory: any;
    setSelectedCategory: (value: any) => void;
    createObject: (object: DataObject) => void;
    editObject: (object: DataObject) => void;
    deleteObject: (id: number) => void;
    refreshData: (url?: string) => void;
    currentPage: number;
    totalPages: number;
    nextUrl: string | null;
    prevUrl: string | null;
    isLoading : boolean;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useContextCategory = () => useContext(Context);

export const CategoryProvider = ({ children }: ProviderProps) => {
    const [data, setData] = useState<DataObject[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false)

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const fetchData = useCallback(async (url?: string) => {
        setIsLoading(true)
        try {
            const response = await getCategories(url);
            console.log("Fetched categories data:", response);
            setData(response.categories);  // Actualiza esto
            console.log("Set data:", response.categories);  // Actualiza esto
            setCurrentPage(response.current || 1);
            setTotalPages(Math.ceil(response.count / TASKS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setIsLoading(false)
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const createObject = async (newObject: DataObject) => {
        try {
            await createCategory(newObject);
            fetchData();
        } catch (error) {
            console.error("Error creating category:", error);
        }
    };

    const editObject = async (updatedObject: DataObject) => {
        try {
            await updateCategory(updatedObject);
            fetchData();
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    const deleteObject = (object: any) => {
        onCloseModals();
        setSelectedCategory(object);
        setIsOpenDeleteModal(true);
    };

    const value = {
        data,
        selectedCategory,
        setSelectedCategory,
        createObject: () => {
            onCloseModals();
            setIsOpenCreateModal(true);
        },
        openCart: () => {
            console.log('open cart');
            setIsOpenCreateModal(true); // Usamos `setIsOpenCreateModal` en lugar de `setIsOpenCartModal`
        },
        editObject: (object: any) => {
            onCloseModals();
            setSelectedCategory(object);
            setIsOpenUpdateModal(true);
        },
        deleteObject,
        refreshData: fetchData,
        currentPage,
        totalPages,
        nextUrl,
        prevUrl,
        isLoading
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                <CreateCategory isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <UpdateCategory category={selectedCategory} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                <DeleteCategory category={selectedCategory} isOpen={isOpenDeleteModal} onClose={onCloseModals} />
                {children}
            </div>
        </Context.Provider>
    );
};

export default useContextCategory;
