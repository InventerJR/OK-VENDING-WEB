'use client';

import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { getWarehousePlaces, getWarehouseWaggons, getProducts, loadWaggon } from '../../../../apiDono';

const CreateLoadModal = dynamic(() => import('./modals/create-load-modal'));
const ConfirmLoadModal = dynamic(() => import('./modals/confirm-load-modal'));

export const ITEMS_PER_PAGE = 10;

export type DataObject = {
    id: number;
    operator: string;
    plate: string;
    load: string;
    last_service_date: string;
}

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    data: any[];
    createObject: () => void;
    confirmLoad: (loadData: any) => void;
    warehouses: any[];
    products: any[];
    handleConfirmLoad: (loadData: any) => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const usePageContext = () => useContext(Context);

export const ContextProvider = ({ children }: ProviderProps) => {
    const data: DataObject[] = [
        {
            id: 1,
            operator: 'Braulio Nvarrete',
            plate: 'ABC-123',
            load: 'Carga 1',
            last_service_date: '2021-01-01',
        },
        {
            id: 2,
            operator: 'Alberto Nvarrete',
            plate: 'ABC-123',
            load: 'Carga 1',
            last_service_date: '2021-01-01',
        },
    ];

    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [waggons, setWaggons] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentObject, setCurrentObject] = useState(null);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
    const [loadData, setLoadData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [warehousePlaces, warehouseWaggons, productData] = await Promise.all([
                    getWarehousePlaces(),
                    getWarehouseWaggons(),
                    getProducts()
                ]);

                setWarehouses([...warehousePlaces.results, ...warehouseWaggons.results]);
                setProducts(productData.results);
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenConfirmModal(false);
    }, []);

    const confirmLoad = (loadData: any) => {
        setLoadData(loadData); 
        setIsOpenCreateModal(false);
        setIsOpenConfirmModal(true);
    };

    const handleConfirmLoad = async (loadData: any) => {
        try {
            await loadWaggon({
                waggon_uuid: loadData.destination,
                place_uuid: loadData.origin,
                products: loadData.products,
                change: loadData.cash,
                load_name: loadData.load_name,
            });
            // Aquí puedes actualizar el estado o hacer cualquier otra cosa después de confirmar la carga
        } catch (error) {
            console.error("Error confirming load:", error);
        }
    };

    const createObject = () => {
        onCloseModals();
        setIsOpenCreateModal(true);
    };

    const value = {
        data,
        createObject,
        confirmLoad,
        warehouses,
        products,
        handleConfirmLoad
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full h-full'>
                <CreateLoadModal
                    isOpen={isOpenCreateModal}
                    onClose={onCloseModals}
                    confirmLoad={confirmLoad}
                    warehouses={warehouses}
                    products={products}
                />
                <ConfirmLoadModal
                    isOpen={isOpenConfirmModal}
                    onClose={onCloseModals}
                    loadData={loadData}
                    warehouses={warehouses}
                    products={products}
                />
                {children}
            </div>
        </Context.Provider>
    );
};
