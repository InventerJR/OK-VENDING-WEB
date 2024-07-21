'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import CartModalView from './cart-modal';
import { getAllSuppliers, loadWaggon } from '../../../../../apiDono';
import { localStorageWrapper } from '@/utils/localStorageWrapper';
import { usePageContext } from '../page.context';

export const TASKS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

export type DataObject = {
    package_quantity: number;
    expiration: any;
    id: number;
    name: string;
    image: string;
    purchase_price: number;
    sale_price: number;
    stock: number;
    investment: number;
    quantity: number;
    uuid: string; // Agrega el uuid al tipo de dato
};

export type SupplierObject = {
    id: number;
    name: string;
    uuid: string;
};

type ContextInterface = {
    products: DataObject[];
    setProducts: React.Dispatch<React.SetStateAction<DataObject[]>>;
    suppliers: SupplierObject[];
    fetchSuppliers: () => void;
    isOpenCartModal: boolean;
    openCartModal: () => void;
    closeCart: () => void;
    addObject: (product: DataObject) => void;
    deleteObject: (index: number) => void;
    updateObjectQuantity: (id: number, quantity: number) => void;
    updateProduct: (index: number, field: keyof DataObject, value: any) => void;
    handleConfirmLoad: () => Promise<void>;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useCartContext = () => useContext(Context);

export const CartContextProvider = ({ children }: ProviderProps) => {
    const { origin, destination, cash } = usePageContext(); // Obtener valores del contexto de la página
    const [products, setProducts] = useState<DataObject[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierObject[]>([]);
    const [isOpenCartModal, setIsOpenCartModal] = useState(false);

    useEffect(() => {
        // Obtener los productos almacenados en el localStorage
        const storedProducts = JSON.parse(localStorageWrapper.getItem('registeredProducts') || '[]');
        // Asignar los productos al estado
        setProducts(storedProducts);
    }, []);

    // Función para obtener la lista de proveedores
    const fetchSuppliers = async () => {
        try {
            const data = await getAllSuppliers();
            setSuppliers(data);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    };

    // Función para agregar un producto al carrito
    const addObject = (product: DataObject) => {
        // Buscar si el producto ya está en el carrito
        const existingProductIndex = products.findIndex(p => p.uuid === product.uuid); // Usa uuid para la comparación
        let updatedProducts;

        // Si el producto ya está en el carrito, incrementa la cantidad
        if (existingProductIndex >= 0) {
            updatedProducts = [...products];
            updatedProducts[existingProductIndex].quantity += 1;
        } else {
            // Si el producto no está en el carrito, agrégalo con cantidad 1
            updatedProducts = [...products, { ...product, quantity: 1 }];
        }

        // Actualiza el estado con el nuevo carrito y guarda en localStorage
        setProducts(updatedProducts);
        localStorageWrapper.setItem('registeredProducts', JSON.stringify(updatedProducts));
    };

    // Función para eliminar un producto del carrito
    const deleteObject = (index: number) => {
        const updatedProducts = [...products];
        updatedProducts.splice(index, 1);
        setProducts(updatedProducts);
        localStorageWrapper.setItem('registeredProducts', JSON.stringify(updatedProducts));
    };

    // Función para actualizar la cantidad de un producto en el carrito
    const updateObjectQuantity = (id: number, quantity: number) => {
        const updatedProducts = products.map(product => {
            if (product.id === id) {
                return { ...product, quantity };
            }
            return product;
        });
        setProducts(updatedProducts);
        localStorageWrapper.setItem('registeredProducts', JSON.stringify(updatedProducts));
    };

    // Función para actualizar un campo específico de un producto en el carrito
    const updateProduct = (index: number, field: keyof DataObject, value: DataObject[keyof DataObject]) => {
        const updatedProducts: DataObject[] = [...products];
        if (updatedProducts[index]) {
            updatedProducts[index] = {
                ...updatedProducts[index],
                [field]: value
            };
            setProducts(updatedProducts);
            localStorageWrapper.setItem('registeredProducts', JSON.stringify(updatedProducts));
        }
    };

    // Función para abrir el modal del carrito
    const openCartModal = () => {
        setIsOpenCartModal(true);
    };

    // Función para cerrar el modal del carrito
    const closeCart = () => {
        setIsOpenCartModal(false);
    };

    // Función para confirmar la carga de la camioneta
    const handleConfirmLoad = async () => {
        // Obtener los productos del carrito
        const productos = JSON.parse(localStorageWrapper.getItem('registeredProducts') || '[]');

        // Validar UUIDs
        if (!origin || !destination || !isValidUUID(origin) || !isValidUUID(destination)) {
            console.error("UUID de la camioneta o del almacén no es válido");
            return;
        }

        // Formato de los productos para el backend
        const productsFormatted = productos.map((product: any) => ({
            product_uuid: product.uuid,
            quantity: product.quantity,
        }));

        // Preparar los datos para la petición
        const loadData = {
            waggon_uuid: destination,
            place_uuid: origin,
            products: productsFormatted,
            change: parseFloat(cash),
        };

        // Enviar la petición al backend
        try {
            const response = await loadWaggon(loadData);
            // Manejar la respuesta del backend (por ejemplo, mostrar un mensaje de éxito)
            console.log('Carga exitosa:', response); // Agregar log para depuración
            // ...
        } catch (error) {
            console.error("Error confirming load:", error);
            // Manejar el error (por ejemplo, mostrar un mensaje de error)
            // ...
        }
    };

    // Función para validar el UUID
    const isValidUUID = (uuid: string) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regex.test(uuid);
    };

    // Valor del contexto
    const value: ContextInterface = {
        products,
        setProducts,
        suppliers,
        fetchSuppliers,
        isOpenCartModal,
        openCartModal,
        closeCart,
        addObject,
        deleteObject,
        updateObjectQuantity,
        updateProduct,
        handleConfirmLoad,
    };

    // Retorna el componente Provider
    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                {isOpenCartModal && <CartModalView isOpen={isOpenCartModal} onClose={closeCart} origin={origin} destination={destination} cash={cash} />}
                {children}
            </div>
        </Context.Provider>
    );
};

export default CartContextProvider;