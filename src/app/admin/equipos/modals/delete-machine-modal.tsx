import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useToast } from '@/components/toasts/use-toasts';
import { usePageContext } from '../page.context';
import { deleteWarehouseMachine } from '../../../../../api';
import { useEffect, useState } from "react";
import { useAppContext } from '@/hooks/useAppContext';
import { localStorageWrapper } from '@/utils/localStorageWrapper';

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

const DeleteMachineModal = (props: Props) => {
    const { loading, setLoading } = useAppContext();
    const { isOpen, onClose } = props;
    const { toastSuccess, toastError } = useToast();
    const { selectedMachine, refreshData, warehousesPlaces } = usePageContext();
    const [warehousePlaceUUID, setWarehousePlaceUUID] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && selectedMachine && selectedMachine.uuid) {
            localStorageWrapper.setItem('selectedMachineUUID', selectedMachine.uuid);
        }
    }, [isOpen, selectedMachine]);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const machine_uuid = localStorageWrapper.getItem('selectedMachineUUID');
            if (!machine_uuid || !warehousePlaceUUID) {
                throw new Error("UUID de la máquina o lugar de almacén no encontrado");
            }
            await deleteWarehouseMachine(machine_uuid, warehousePlaceUUID);
            toastSuccess({ message: "Máquina eliminada correctamente" });
            localStorageWrapper.removeItem('selectedMachineUUID'); // Elimina el UUID del localStorageWrapper
            refreshData();
            onClose();
        } catch (error: any) {
            toastError({ message: error.message });
        }finally{
            setLoading(false);
        }
    };

    const handleClose = () => {
        localStorageWrapper.removeItem('selectedMachineUUID'); // Elimina el UUID del localStorageWrapper
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
                    <span className="font-bold text-xl">ELIMINAR MÁQUINA</span>
                </div>

                <div className="p-6 flex flex-col gap-4 text-center">
                    <p className="font-bold">
                        ¿Deseas borrar {selectedMachine?.name} del sistema?
                    </p>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="warehouse-place" className="font-bold text-sm">Selecciona el almacén hacia donde se irá el prodcuto de la máquina:</label>
                        <select
                            id="warehouse-place"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            onChange={(e) => setWarehousePlaceUUID(e.target.value)}
                        >
                            <option value="">Seleccionar lugar de almacén</option>
                            {warehousesPlaces.map((place) => (
                                <option key={place.uuid} value={place.uuid}>{place.name}</option>
                            ))}
                        </select>
                    </div>
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

export default DeleteMachineModal;
