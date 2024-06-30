import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import CreateWagonWarehouse from './modals/create-wagon-warehouse';
//import UpdateCategoryModal from '../../cargas/modals/update-load-modal';

const CartModal = dynamic(() => import('./modals/cart/cart-modal'));
//const DeleteProductModal = dynamic(() => import('./modals/delete-product-modal'));
const UpdateWagonWarehouseModal = dynamic(() => import('./modals/update-wagon-warehouse'));

export const TASKS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

export type DataObject = {
    id: number;
    plate: string;
    last_service_date: string;
    tank: number;
    consumption: number;
    kilometers: number;
    cash: number;
    insurance_expiration_date: string;

};

type ContextInterface = {

    selectedWagon: any;
    setSelectedWagon: (value: any) => void;
    products: any[];
    data: any[];
    openCart: () => void;
    createObject: (object: any) => void;
    editObject: (object: any) => void;
    deleteObject: (id: number) => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

/**
 * To be used in the component that will consume the context
 * @returns any
 */
export const useSalesAdminContext = () => useContext(Context);

/** Context Provider Component **/
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
    const [selectedWagon, setSelectedWagon] = useState(null);
    
    

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

    

    const value: ContextInterface = {
        products: products,
        data,
        openCart: () => {
            console.log('open cart');
            setIsOpenCartModal(true);
        },
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
        },
        selectedWagon,
        setSelectedWagon,
    };

    return (
        <Context.Provider
            value={value}
        >
            <div className='relative w-full'>
                <CreateWagonWarehouse isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <UpdateWagonWarehouseModal wagon={selectedWagon} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
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
]