import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// const CreateUserModal = dynamic(() => import('./modals/create-user-modal'));
// const DeleteUserModal = dynamic(() => import('./modals/delete-user-modal'));
// const UpdateUserModal = dynamic(() => import('./modals/update-user-modal'));

export const TASKS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {

    products: any[];

    // isOpenCreateModal: boolean;
    // isOpenDeleteModal: boolean;
    // isOpenUpdateModal: boolean;
    // setIsOpenCreateModal: (value: boolean) => void;
    // setIsOpenDeleteModal: (value: boolean) => void;
    // setIsOpenUpdateModal: (value: boolean) => void;
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
    ]

    // const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    // const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    // const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

    // const onCloseModals = useCallback(() => {
    //     setIsOpenCreateModal(false);
    //     setIsOpenUpdateModal(false);
    //     setIsOpenDeleteModal(false);
    // }, []);

    const value = {
        products: products,
        // isOpenCreateModal,
        // isOpenDeleteModal,
        // isOpenUpdateModal,
        // setIsOpenCreateModal,
        // setIsOpenDeleteModal,
        // setIsOpenUpdateModal,
    };

    return (
        <Context.Provider
            value={value}
        >
            <div className='relative w-full'>
                {/* {isOpenCreateModal && <CreateUserModal isOpen={isOpenCreateModal} onClose={onCloseModals} />} */}
                {/* <CreateUserModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <DeleteUserModal isOpen={isOpenDeleteModal} onClose={onCloseModals} />
                <UpdateUserModal isOpen={isOpenUpdateModal} onClose={onCloseModals} /> */}
                {children}
            </div>
        </Context.Provider>
    );
};
