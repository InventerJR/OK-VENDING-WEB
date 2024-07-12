import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useToast } from '@/components/toasts/use-toasts';
import { useSalesAdminContext } from '../sales-admin.context';
import { deleteWarehouseWaggon } from '../../../../../../api';
import { useEffect } from "react";
import { useAppContext } from "@/hooks/useAppContext";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    wagon: any; // La camioneta seleccionada para eliminar
}

const DeleteWagonWarehouseModal = (props: Props) => {
    const { loading, setLoading } = useAppContext();
    const { isOpen, onClose, wagon } = props;
    const { toastSuccess, toastError } = useToast();
    const { refreshData } = useSalesAdminContext();

    useEffect(() => {
        if (isOpen && wagon && wagon.uuid) {
            localStorage.setItem('selectedWagonUUID', wagon.uuid);
        }
    }, [isOpen, wagon]);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const uuid = localStorage.getItem('selectedWagonUUID');
            if (!uuid) {
                throw new Error("UUID de la camioneta no encontrado");
            }
            await deleteWarehouseWaggon(uuid);
            toastSuccess({ message: "Camioneta eliminada correctamente" });
            localStorage.removeItem('selectedWagonUUID'); // Elimina el UUID del localStorage
            refreshData();
            onClose();
        } catch (error: any) {
            toastError({ message: error.message });
        }finally{
            setLoading(false);
        }
    };

    const handleClose = () => {
        localStorage.removeItem('selectedWagonUUID'); // Elimina el UUID del localStorage
        onClose();
    };

    return (
        <ModalContainer visible={isOpen} onClose={handleClose}>
            <div className="flex flex-col p-6 relative">
                <div className="absolute right-4 top-6">
                    <button className="font-bold font-sans p-3 -m-3" onClick={handleClose}>
                        <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                    </button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">ELIMINAR CAMIONETA</span>
                </div>

                <div className="p-6 flex flex-col gap-4 text-center">
                    <p className="font-bold">
                        ¿Deseas borrar {wagon?.plate} del sistema?
                    </p>
                </div>

                <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                    <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2"
                        onClick={handleClose}>
                        <span>Cancelar</span>
                    </button>
                    <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2"
                        onClick={handleDelete}>
                        <span>Borrar</span>
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
};

export default DeleteWagonWarehouseModal;
