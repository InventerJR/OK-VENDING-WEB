import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CreateUserModal = dynamic(() => import('./modals/create-user-modal'));
const DeleteUserModal = dynamic(() => import('./modals/delete-user-modal'));
const UpdateUserModal = dynamic(() => import('./modals/update-user-modal'));

export const TASKS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {

    users: any[];

    isOpenCreateModal: boolean;
    isOpenDeleteModal: boolean;
    isOpenUpdateModal: boolean;
    setIsOpenCreateModal: (value: boolean) => void;
    setIsOpenDeleteModal: (value: boolean) => void;
    setIsOpenUpdateModal: (value: boolean) => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

/**
 * to be used in components that are children of the Context Provider
 * @returns any
 */
export const useUsersAdminContext = () => useContext(Context);


/** Context Provider Component **/
export const UsersAdminContextProvider = ({
    children,
}: ProviderProps) => {
    const users = [
        {
            id: 1,
            name: 'Juan Perez',
            phone: '1234567890',
            email: 'jperez@gmail.com',
            type: 'admin'
        },
        {
            id: 1,
            name: 'Juan Perez',
            phone: '1234567890',
            email: 'jperez@gmail.com',
            type: 'admin'
        },
        {
            id: 1,
            name: 'Juan Perez',
            phone: '1234567890',
            email: 'jperez@gmail.com',
            type: 'admin'
        },
        {
            id: 1,
            name: 'Juan Perez',
            phone: '1234567890',
            email: 'jperez@gmail.com',
            type: 'admin'
        },
        {
            id: 1,
            name: 'Juan Perez',
            phone: '1234567890',
            email: 'jperez@gmail.com',
            type: 'admin'
        },
        {
            id: 1,
            name: 'Juan Perez',
            phone: '1234567890',
            email: 'jperez@gmail.com',
            type: 'admin'
        },
        {
            id: 1,
            name: 'Juan Perez',
            phone: '1234567890',
            email: 'jperez@gmail.com',
            type: 'admin'
        },
        {
            id: 1,
            name: 'Juan Perez',
            phone: '1234567890',
            email: 'jperez@gmail.com',
            type: 'admin'
        },
        {
            id: 1,
            name: 'Juan Perez',
            phone: '1234567890',
            email: 'jperez@gmail.com',
            type: 'admin'
        },
        {
            id: 1,
            name: 'Juan Perez',
            phone: '1234567890',
            email: 'jperez@gmail.com',
            type: 'admin'
        },
        {
            id: 1,
            name: 'Juan Perez',
            phone: '1234567890',
            email: 'jperez@gmail.com',
            type: 'admin'
        },
    ]

    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const value = {
        users,
        isOpenCreateModal,
        isOpenDeleteModal,
        isOpenUpdateModal,
        setIsOpenCreateModal,
        setIsOpenDeleteModal,
        setIsOpenUpdateModal,
    };

    return (
        <Context.Provider
            value={value}
        >
            <div className='relative w-full'>
                {/* {isOpenCreateModal && <CreateUserModal isOpen={isOpenCreateModal} onClose={onCloseModals} />} */}
                <CreateUserModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <DeleteUserModal isOpen={isOpenDeleteModal} onClose={onCloseModals} />
                <UpdateUserModal isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                {children}
            </div>
        </Context.Provider>
    );
};
