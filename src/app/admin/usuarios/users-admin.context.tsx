import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getUsers } from '../../../../api'; // Asegúrate de ajustar la ruta
import { useToast } from '@/components/toasts/use-toasts';

const CreateUserModal = dynamic(() => import('./modals/create-user-modal'));
const DeleteUserModal = dynamic(() => import('./modals/delete-user-modal'));
const UpdateUserModal = dynamic(() => import('./modals/update-user-modal'));

export const TASKS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    selectUser: any;
    setSelectUser: (value: any) => void;
    users: any[];
    isOpenCreateModal: boolean;
    isOpenDeleteModal: boolean;
    isOpenUpdateModal: boolean;
    setIsOpenCreateModal: (value: boolean) => void;
    setIsOpenDeleteModal: (value: boolean) => void;
    setIsOpenUpdateModal: (value: boolean) => void;
    fetchUsers: () => void;
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
    const { toastError } = useToast();
    const [users, setUsers] = useState([]);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [selectUser, setSelectUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data.results); // Ajuste para usar los datos de "results"
        } catch (error) {
            toastError({ message: "erorr"});
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onCloseModals = useCallback(() => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    }, []);

    const value = {
        selectUser,
        setSelectUser,
        users,
        isOpenCreateModal,
        isOpenDeleteModal,
        isOpenUpdateModal,
        setIsOpenCreateModal,
        setIsOpenDeleteModal,
        setIsOpenUpdateModal,
        fetchUsers,
    };

    return (
        <Context.Provider value={value}>
            <div className='relative w-full'>
                <CreateUserModal isOpen={isOpenCreateModal} onClose={onCloseModals} />
                <DeleteUserModal isOpen={isOpenDeleteModal} onClose={onCloseModals} />
                <UpdateUserModal user={selectUser} isOpen={isOpenUpdateModal} onClose={onCloseModals} />
                {children}
            </div>
        </Context.Provider>
    );
};
