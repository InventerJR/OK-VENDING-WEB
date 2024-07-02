// useAppContext.tsx

import classNames from 'classnames';
import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ToastProvider } from '../components/toasts/use-toasts';
import DefaultModal from '@/components/default-modal';
import { getAPIToken, setAPIToken, removeAPIToken } from '@/utils/Auth';
import { getUsers } from '../../api';

const SyncLoader = dynamic(() => import('react-spinners/SyncLoader'));

export const TASKS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    handledOk: React.Dispatch<() => void>;
    setHandledOk: (handledOk: () => void) => void;
    titleModal: string;
    setTitleModal: (title: string) => void;
    messageModal: string;
    setMessageModal: (message: string) => void;
    isOpenModal: boolean;
    setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    drawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    authData: { token: string | null; userData: any };
    setAuthData: (data: { token: string | null; userData: any }) => void;
    logout: () => void;
    refreshUsers: () => void;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

export const useAppContext = () => useContext(Context);

export const AppContextProvider = ({ children }: ProviderProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(true);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [titleModal, setTitleModal] = useState<string>("");
    const [messageModal, setMessageModal] = useState<string>("");
    const [handledOk, setHandledOk] = useState<() => void>(() => { });
    const [authData, setAuthDataState] = useState<{ token: string | null; userData: any }>({ token: null, userData: null });
    const [users, setUsers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [prevUrl, setPrevUrl] = useState<string | null>(null);

    const setAuthData = (data: { token: string | null; userData: any }) => {
        setAuthDataState(data);
        setAPIToken(data.token, data.userData);
    };

    const fetchUsers = useCallback(async (url?: string) => {
        const response = await getUsers(url);
        setUsers(response.results);
        setCurrentPage(response.current);
        setTotalPages(Math.ceil(response.count / TASKS_PER_PAGE));
        setNextUrl(response.next);
        setPrevUrl(response.previous);
    }, []);

    const refreshUsers = () => {
        fetchUsers();
    };

    const logout = () => {
        removeAPIToken();
        setAuthDataState({ token: null, userData: null });
    };

    const handledClose = () => {
        setIsOpenModal(false);
        setTitleModal("");
        setMessageModal("");
        setHandledOk(() => { });
    };

    useEffect(() => {
        const fetchToken = async () => {
            const [token, userData] = await getAPIToken();
            setAuthDataState({ token, userData });
        };
        fetchToken();
    }, []);

    const value = {
        loading,
        setLoading,
        drawerOpen,
        setDrawerOpen,
        visible,
        setVisible,
        isOpenModal,
        setIsOpenModal,
        titleModal,
        setTitleModal,
        messageModal,
        setMessageModal,
        handledOk,
        setHandledOk,
        authData,
        setAuthData,
        logout,
        refreshUsers, // Añadimos la función refreshUsers
    };

    return (
        <Context.Provider value={value}>
            <ToastProvider>
                {children}
            </ToastProvider>
            <div className={classNames({
                'z-[999] absolute left-0 top-0 right-0 bottom-0 transition-opacity': true,
                'opacity-0 pointer-events-none  duration-500': !loading,
                'opacity-100 pointer-events-auto  duration-300': loading,
            })}>
                <div className='z-[999] relaltive h-[100dvh] w-full bg-[#0009] '>
                    <div className='z-[999] absolute bg-white h-24 w-24 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-lg'>
                        <SyncLoader color="#58B7A3" size={15} speedMultiplier={0.6} />
                    </div>
                </div>
            </div>
            <DefaultModal isOpen={isOpenModal} onClose={() => handledClose()}
                title={titleModal} message={messageModal} handledOk={() => handledOk()} />
        </Context.Provider>
    );
};