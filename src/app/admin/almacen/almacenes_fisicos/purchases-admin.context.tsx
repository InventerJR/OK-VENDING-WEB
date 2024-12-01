import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getWarehousePlaces, getUsers, getWarehousesByUser } from '../../../../../api'; // Asegúrate de ajustar la ruta
import DeleteWarehouseModal from './modals/delete-warehouse-modal';

const CartModal = dynamic(() => import('./modals/cart/cart-modal'));
const CreateWarehouseModal = dynamic(() => import('./modals/create-warehouse-modal'));
const UpdateWarehouseModal = dynamic(() => import('./modals/update-warehouse-modal'));

export const TASKS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    uuid:string;
    name: string;
    zipcode: string;
    address: string;
    phone: string;
    almacenista: {
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

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    data: DataObject[];
    products: any[];
    selectedWarehouse: any;
    setSelectedWarehouse: (value: any) => void;
    createObject: (object: DataObject) => void;
    openCart: () => void;
    editObject: (object: DataObject) => void;
    deleteObject: (id: number) => void;
    refreshData: (url?: string) => void;
    currentPage: number;
    totalPages: number;
    nextUrl: string | null;
    prevUrl: string | null;
    users: User[];
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePurchasesAdminContext = () => useContext(Context);

export const PurchasesAdminContextProvider = ({
    children,
}: ProviderProps) => {
    const [data, setData] = useState<DataObject[]>([]);
    const [products, setProducts] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const fetchData = useCallback(async () => {
        try {
            // Obtiene los almacenes filtrados por tipo de usuario
            const response = await getWarehousesByUser();
            setData(response.results); // Asegúrate de que `results` contenga la lista de almacenes
    
            // Configura la paginación
            setCurrentPage(response.current || 1);
            setTotalPages(Math.ceil(response.count / TASKS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);
    
            // Obtiene la lista de usuarios
            const usersResponse = await getUsers();
            setUsers(usersResponse.results);
        } catch (error) {
            console.error("Error al obtener los almacenes o usuarios:", error);
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

    const deleteObject = (object: any) => {
        onCloseModals();
        setSelectedWarehouse(object);
        setIsOpenDeleteModal(true);
    };

    const value = {
        products,
        data,
        selectedWarehouse,
        setSelectedWarehouse,
        createObject: () => {
            onCloseModals();
            setIsOpenCreateModal(true);
        },
        openCart: () => {
            console.log('open cart');
            setIsOpenCreateModal(true); // Usamos setIsOpenCreateModal en lugar de setIsOpenCartModal
        },
        editObject: (object: any) => {
            onCloseModals();
            setSelectedWarehouse(object);
            setIsOpenUpdateModal(true);
        },
        deleteObject,
        refreshData: fetchData,
        currentPage,
        totalPages,
        nextUrl,
        prevUrl,
        users
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                <CreateWarehouseModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <UpdateWarehouseModal warehouse={selectedWarehouse} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                <DeleteWarehouseModal isOpen={isOpenDeleteModal} onClose={onCloseModals} warehouse={selectedWarehouse} />
                {children}
            </div>
        </Context.Provider>
    );
};

export default PurchasesAdminContextProvider;