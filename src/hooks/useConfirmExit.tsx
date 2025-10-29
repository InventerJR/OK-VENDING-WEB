import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from './useAppContext'; // Ajusta esta ruta según la ubicación de tu AppContext

const useConfirmExit = (shouldConfirm: boolean) => {
    const router = useRouter();
    const { setIsOpenModal, setHandledOk, setTitleModal, setMessageModal } = useAppContext();

    const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
        if (shouldConfirm) {
            event.preventDefault();
            event.returnValue = '';
        }
    }, [shouldConfirm]);

    const handleRouteChange = useCallback(
        (url: string) => {
            if (shouldConfirm && router.pathname !== url) {
                setTitleModal('Confirmación de salida');
                setMessageModal('¿Estás seguro de que deseas abandonar esta página? Los cambios no guardados se perderán.');
                setIsOpenModal(true);

                setHandledOk(() => () => {
                    setIsOpenModal(false);
                    router.push(url);
                });

                throw 'Abort route change'; // Evita el cambio de ruta inmediatamente
            }
        },
        [shouldConfirm, router, setTitleModal, setMessageModal, setIsOpenModal, setHandledOk]
    );

    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload);
        router.events.on('routeChangeStart', handleRouteChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [handleBeforeUnload, handleRouteChange, router.events]);

    return null;
};

export default useConfirmExit;
