import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getWarehouseWaggons, getUsers, deleteWarehouseWaggon } from '../../../../../api'; // Asegúrate de ajustar la ruta
import CreateWagonWarehouse from './modals/create-wagon-warehouse';
//import UpdateCategoryModal from '../../cargas/modals/update-load-modal';

const CartModal = dynamic(() => import('./modals/cart/cart-modal'));

export const TASKS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

export type DataObject = {
    id: number;
    uuid: string;
    plate: string;
    last_service_date: string;
    tank: number;
    consumption: number;
    mileage: number;
    cash: number;
    insurance_end_date: string;
    driver: {
        id: number;
        first_name: string;
        last_name: string;
        uuid: string;
    };
};

type User = {
    id: number;
    first_name: string;
    last_name: string;
    uuid: string;
};

type ContextInterface = {
    selectedWagon: any;
    setSelectedWagon: (value: any) => void;
    products: any[];
    data: DataObject[];
    users: User[];
    openCart: () => void;
    createObject: (object: any) => void;
    editObject: (object: any) => void;
    deleteObject: (object: any) => void;
    refreshData: (url?: string) => void;
    currentPage: number;
    totalPages: number;
    nextUrl: string | null;
    prevUrl: string | null;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useSalesAdminContext = () => useContext(Context);

export const SalesAdminContextProvider = ({
    children,
}: ProviderProps) => {

    const data: DataObject[] = [
        {
            id: 1,
            plate: 'GPD-996-F',
            last_service_date: "2015-03-25",
            tank: 10,
            consumption: 10,
            kilometers: 10,
            cash: 10,
            insurance_expiration_date: "2015-03-25",
        },
        {
            id: 2,
            plate: 'GPD-996-A',
            last_service_date: "2015-03-25",
            tank: 10,
            consumption: 10,
            kilometers: 10,
            cash: 10,
            insurance_expiration_date: "2015-03-25",
        },

    ];

    const [current_object, setCurrentObject] = useState(null);

    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
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
            const waggonsResponse = await getWarehouseWaggons(url);
            setData(waggonsResponse.results);
            setCurrentPage(waggonsResponse.current || 1);
            setTotalPages(Math.ceil(waggonsResponse.count / TASKS_PER_PAGE));
            setNextUrl(waggonsResponse.next);
            setPrevUrl(waggonsResponse.previous);

            const usersResponse = await getUsers();
            setUsers(usersResponse.results);
        } catch (error) {
            console.error("Error fetching warehouse waggons or users:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const createObject = (newObject: DataObject) => {
        // Lógica para crear objeto
    };

    const editObject = (updatedObject: DataObject) => {
        // Lógica para editar objeto
    };

    const deleteObject = async (uuid: string) => {
        try {
            await deleteWarehouseWaggon(uuid);
            onCloseModals();
            
        } catch (error) {
            console.error("Error deleting warehouse waggon:", error);
        }
    };

    const value: ContextInterface = {
        products,
        data,
        users,
        selectedWagon,
        setSelectedWagon,
        openCart: () => {
            console.log('open cart');
            setIsOpenCreateModal(true);
        },
        createObject: () => {
            onCloseModals();
            setIsOpenCreateModal(true);
        },
        editObject: (object: any) => {
            onCloseModals();
            setSelectedWagon(object);
            setIsOpenUpdateModal(true);
        },
        deleteObject: (object: any) => {
            onCloseModals();
            setSelectedWagon(object);
            setIsOpenDeleteModal(true);
        },
        refreshData: fetchData,
        currentPage,
        totalPages,
        nextUrl,
        prevUrl,
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                <CreateWagonWarehouse isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <UpdateWagonWarehouseModal wagon={selectedWagon} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                <DeleteWagonWarehouseModal isOpen={isOpenDeleteModal} onClose={onCloseModals} wagon={selectedWagon} />
                {<CartModal isOpen={isOpenCreateModal} onClose={onCloseModals} />}
                {children}
            </div>
        </Context.Provider>
    );
};

export default SalesAdminContextProvider;
