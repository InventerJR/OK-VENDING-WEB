import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import DeleteWarehouseModal from './modals/delete-warehouse-modal';

const CartModal = dynamic(() => import('./modals/cart/cart-modal'));
const CreateWarehouseModal = dynamic(() => import('./modals/create-warehouse-modal'));
//const DeleteWarehouseModal = dynamic(() => import('./modals/delete-warehouse-modal'));
const UpdateWarehouseModal = dynamic(() => import('./modals/update-warehouse-modal'));

export const TASKS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    name: string;
    zipcode: string;
    address: string;
    phone: string;
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
    deleteObject: (id: number) => void; // Recibe el ID del objeto a eliminar
};

const Context = createContext<ContextInterface>({} as ContextInterface);

/**
 * To be used in the component that will consume the context
 * @returns any
 */
export const usePurchasesAdminContext = () => useContext(Context);

/** Context Provider Component **/
export const PurchasesAdminContextProvider = ({
    children,
}: ProviderProps) => {

    const data: DataObject[] = [
        {
            id: 1,
            name: 'Almacen 1',
            zipcode: '37111',
            address: 'Address 1',
            phone: '1234567890',
        },
        {
            id: 2,
            name: 'Almacen 2',
            zipcode: '37111',
            address: 'Address 2',
            phone: '1234567890',
        },
        {
            id: 3,
            name: 'Almacen 3',
            zipcode: '37111',
            address: 'Address 3',
            phone: '1234567890',
        },
    ];

    const [current_object, setCurrentObject] = useState(null);

    const [isOpenCartModal, setIsOpenCartModal] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const [nextId, setNextId] = useState(4);

    const createObject = (newObject: DataObject) => {
        // Asigna un nuevo ID al objeto
        /*newObject.id = nextId;
        setNextId(nextId + 1);

        // Agrega el objeto al array de datos
        setData([...data, newObject]);*/
    };

    const editObject = (updatedObject: DataObject) => {
        // Encuentra el índice del objeto a actualizar
        const index = data.findIndex((obj) => obj.id === updatedObject.id);

        // Actualiza el objeto en el array de datos
        /*if (index !== -1) {
            const newData = [...data];
            newData[index] = updatedObject;
            setData(newData);
        }*/
    };

    const deleteObject = (id: number) => {
        // Filtra el array de datos para eliminar el objeto con el ID especificado
        //const newData = data.filter((obj) => obj.id !== id);
        //setData(newData);
    };

    const value = {
        products: products,
        data,
        selectedWarehouse,
        setSelectedWarehouse,
        createObject: () => {
            onCloseModals();
            setIsOpenCreateModal(true);
        },
        openCart: () => {
            console.log('open cart');
            setIsOpenCartModal(true);
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
                <CreateWarehouseModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <UpdateWarehouseModal warehouse={selectedWarehouse} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                <DeleteWarehouseModal isOpen={isOpenDeleteModal} onClose={onCloseModals} />
                {<CartModal isOpen={isOpenCartModal} onClose={onCloseModals} />}
                {children}
            </div>
        </Context.Provider>
    );
};


const products = [
    {
        id: 1,
        name: 'Boing de mango',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 10,
        investment: 10
    },
    {
        id: 1,
        name: 'Boing de mango',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 10,
        investment: 10
    },
    {
        id: 1,
        name: 'Boing de mango',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 10,
        investment: 10
    },
    {
        id: 1,
        name: 'Boing de mango',
        image: '',
        purchase_price: 10,
        sale_price: 10.50,
        stock: 10,
        investment: 10
    },
];

export default PurchasesAdminContextProvider;


