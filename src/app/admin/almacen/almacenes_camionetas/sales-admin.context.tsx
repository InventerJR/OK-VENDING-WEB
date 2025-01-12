import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getWarehouseWaggons, getUsers, deleteWarehouseWaggon } from '../../../../../api'; // Asegúrate de ajustar la ruta
import CreateWagonWarehouse from './modals/create-wagon-warehouse';
import UpdateWagonWarehouseModal from './modals/update-wagon-warehouse';
import DeleteWagonWarehouseModal from './modals/delete-wagon-warehouse'; // Importa el modal de eliminación

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
    isLoading: boolean;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useSalesAdminContext = () => useContext(Context);

export const SalesAdminContextProvider = ({
    children,
}: ProviderProps) => {
    const [data, setData] = useState<DataObject[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState([]);
    const [selectedWagon, setSelectedWagon] = useState(null);
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
        } finally {
            setIsLoading(false)
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
        isLoading
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
