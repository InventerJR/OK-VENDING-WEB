import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getUsers } from '../../../../api'; // Ajusta la ruta según sea necesario

const CreateUserModal = dynamic(() => import('./modals/create-user-modal'));
const DeleteUserModal = dynamic(() => import('./modals/delete-user-modal'));
const UpdateUserModal = dynamic(() => import('./modals/update-user-modal'));

export const TASKS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    users: any[];
    fetchUsers: (url?: string) => Promise<void>;
    currentPage: number;
    totalPages: number;
    nextUrl: string | null;
    prevUrl: string | null;
    setIsOpenCreateModal: (value: boolean) => void;
    setIsOpenDeleteModal: (value: boolean) => void;
    setIsOpenUpdateModal: (value: boolean) => void;
    setSelectUser: (value: any) => void;
    filterName: string;
    setFilterName: (value: string) => void;
    filterType: string;
    setFilterType: (value: string) => void;
    isLoading: boolean;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useUsersAdminContext = () => useContext(Context);

export const UsersAdminContextProvider = ({ children }: ProviderProps) => {
    const [users, setUsers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
    const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [selectUser, setSelectUser] = useState(null);
    const [filterName, setFilterName] = useState('');
    const [filterType, setFilterType] = useState('');
    const [isLoading, setIsLoading] = useState(true)

    const fetchUsers = useCallback(async (url?: string) => {
        setIsLoading(true);
        const response = await getUsers(url);
        setIsLoading(false);
        setUsers(response.results);
        setCurrentPage(response.current);
        setTotalPages(Math.ceil(response.count / TASKS_PER_PAGE));
        setNextUrl(response.next);
        setPrevUrl(response.previous);
    }, []);

    const filteredUsers = users.filter(user => 
        (filterName === '' || `${user.first_name} ${user.last_name} ${user.second_last_name}`.toLowerCase().includes(filterName.toLowerCase())) &&
        (filterType === '' || user.type_user === parseInt(filterType))
    );

    const onCloseModals = () => {
        setIsOpenCreateModal(false);
        setIsOpenUpdateModal(false);
        setIsOpenDeleteModal(false);
    };

    const value = {
        users: filteredUsers,
        fetchUsers,
        currentPage,
        totalPages,
        nextUrl,
        prevUrl,
        setIsOpenCreateModal,
        setIsOpenDeleteModal,
        setIsOpenUpdateModal,
        setSelectUser,
        filterName,
        setFilterName,
        filterType,
        setFilterType,
        isLoading
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
