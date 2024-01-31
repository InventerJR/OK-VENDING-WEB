


{/* <SyncLoader color="#58B7A3" loading={true} size={15} /> */ }

import classNames from 'classnames';
import dynamic from 'next/dynamic';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
// import { SyncLoader } from 'react-spinners';

const SyncLoader = dynamic(() => import('react-spinners/SyncLoader'));

export const TASKS_PER_PAGE = 10;

interface ProviderProps {
    children?: React.ReactNode;
}

type ContextInterface = {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    drawerOpen: boolean;
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const Context = createContext<ContextInterface>({} as ContextInterface);

/**
 * to be used in components that are children of the Context Provider
 * @returns any
 */
export const useAppContext = () => useContext(Context);


/** Context Provider Component **/
export const AppContextProvider = ({
    children,
}: ProviderProps) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(true);

    const value = {
        loading,
        setLoading,
        drawerOpen,
        setDrawerOpen,
        visible,
        setVisible,
    };

    return (
        <Context.Provider
            value={value}
        >
            {children}
            <div className={classNames({
                'z-[999] absolute left-0 top-0 right-0 bottom-0 transition-opacity': true,
                'opacity-0 pointer-events-none': !loading,
                'opacity-100 pointer-events-auto': loading,
            })}>
                <div className='z-[999] relaltive h-[100dvh] w-full bg-[#0009] '>
                    <div className='z-[999] absolute bg-white h-24 w-24 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-lg'>
                        <SyncLoader color="#58B7A3" size={15} speedMultiplier={0.6} />
                    </div>
                </div>
            </div>
        </Context.Provider>
    );
};
