import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getWarehouseMachines, getWarehouseMachineByUUID, getAllWarehousePlaces, getProducts, getWarehousesMachineAddresses } from '../../../../api'; // Asegúrate de ajustar la ruta

const CreateMachineModal = dynamic(() => import('./modals/create-machine-modal'));
const DeleteMachineModal = dynamic(() => import('./modals/delete-machine-modal'));
const UpdateMachineModal = dynamic(() => import('./modals/update-machine-modal'));

export const ITEMS_PER_PAGE = 10;

export type Slot = {
    position: number;
    depth: number;
};

export type Tray = {
    position: number;
    slots: Slot[];
};

export type Product = {
    product_uuid: string;
    stock: number;
    stock_expired: number;
    quantity: number;
};

export type DataObject = {
    uuid: string;
    name: string;
    pocket_money: string;
    address: string;
    zipcode: string;
    city_name: string;
    state_name: string;
    lat: number;
    lng: number;
    trays: Tray[];
    productos: Product[];
    image: string; // Assuming image is a URL or base64 string; adjust if needed
};

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    data: DataObject[];
    products: any[];
    addresses: any[];
    warehousesPlaces: any[];
    selectedMachine: any;
    setSelectedMachine: (value: any) => void;
    setAddresses: (value: any) => void;  // Añadir esta línea
    openCart: () => void;
    createObject: () => void;
    editObject: (uuid: string) => void;
    deleteObject: (uuid: string) => void;
    refreshData: (url?: string) => void;
    currentPage: number;
    totalPages: number;
    nextUrl: string | null;
    prevUrl: string | null;
    setCurrentPage: (page: number) => void;
};


const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

/** Context Provider Component **/
export const ContextProvider = ({
    children,
}: ProviderProps) => {
    const [data, setData] = useState<DataObject[]>([]);
    const [products, setProducts] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [warehousesPlaces, setWarehousesPlaces] = useState<any[]>([]);
    const [selectedMachine, setSelectedMachine] = useState<any>(null);
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
            const response = await getWarehouseMachines(url);
            setData(response.results);
            setCurrentPage(response.current || 1);
            setTotalPages(Math.ceil(response.count / ITEMS_PER_PAGE));
            setNextUrl(response.next);
            setPrevUrl(response.previous);
        } catch (error) {
            console.error("Error fetching warehouse machines:", error);
        }
    }, []);

    const fetchWarehousesPlaces = useCallback(async () => {
        try {
            const response = await getAllWarehousePlaces();
            setWarehousesPlaces(response); // Asegúrate de que el endpoint devuelve un array
        } catch (error) {
            console.error("Error fetching warehouse places:", error);
            setWarehousesPlaces([]); // Inicializa como array vacío en caso de error
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await getProducts();
            setProducts(response); // Asegúrate de que el endpoint devuelve un array
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]); // Inicializa como array vacío en caso de error
        }
    }, []);

    const fetchAddresses = useCallback(async () => {
        try {
            const response = await getWarehousesMachineAddresses();
            setAddresses(response); // Asegúrate de que el endpoint devuelve un array
        } catch (error) {
            console.error("Error fetching warehouses machines addresses:", error);
            setAddresses([]); // Inicializa como array vacío en caso de error
        }
    }, []);

    useEffect(() => {
        fetchData();
        fetchWarehousesPlaces();
        fetchProducts();
        fetchAddresses(); // Añadir este fetch aquí
    }, [fetchData, fetchWarehousesPlaces, fetchProducts, fetchAddresses]);

    const createObject = () => {
        onCloseModals();
        setIsOpenCreateModal(true);
    };

    const editObject = async (uuid: string) => {
        try {
            const machine = await getWarehouseMachineByUUID(uuid);
            localStorage.setItem('selectedMachineUUID', uuid);
            setSelectedMachine(machine);
            setIsOpenUpdateModal(true);
        } catch (error) {
            console.error("Error fetching machine details:", error);
        }
    };

    const deleteObject = (uuid: string) => {
        onCloseModals();
        setSelectedMachine(uuid);
        setIsOpenDeleteModal(true);
    };

    const value: ContextInterface = {
        data,
        products,
        addresses,  // Asegúrate de incluir addresses aquí
        setAddresses,  // Asegúrate de incluir setAddresses aquí
        warehousesPlaces,
        selectedMachine,
        setSelectedMachine,
        openCart: () => {
            console.log('open cart');
        },
        createObject,
        editObject,
        deleteObject,
        refreshData: fetchData,
        currentPage,
        totalPages,
        nextUrl,
        prevUrl,
        setCurrentPage,
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                <CreateMachineModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <DeleteMachineModal isOpen={isOpenDeleteModal} onClose={onCloseModals} />
                <UpdateMachineModal machine={selectedMachine} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                {children}
            </div>
        </Context.Provider>
    );
};

export default ContextProvider;

