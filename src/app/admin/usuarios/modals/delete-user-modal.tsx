// delete-user-modal.tsx

import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useToast } from "@/components/toasts/use-toasts";
import { deleteUser } from "../../../../../api";
import { useAppContext } from '@/hooks/useAppContext';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function DeleteUserModal(props: Props) {
    const { isOpen, onClose } = props;
    const { toastSuccess, toastError } = useToast();
    const { refreshUsers } = useAppContext();

    const handleDelete = async () => {
        const uuid = localStorage.getItem("selectedUserUUID");
        if (!uuid) {
            toastError({ message: "UUID no encontrado en local storage" });
            return;
        }

        try {
            await deleteUser(uuid); // Aquí pasamos solo el UUID
            toastSuccess({ message: "Usuario eliminado" });
            refreshUsers(); // Refrescar la tabla después de eliminar
            onClose();
        } catch (error: any) {
            toastError({ message: error.message });
        }
    };

    return (
        <ModalContainer visible={isOpen} onClose={onClose}>
            <div className="flex flex-col p-6 relative">
                <div className="absolute right-4 top-6">
                    <button className="font-bold font-sans p-3 -m-3" onClick={onClose}>
                        <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                    </button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">ELIMINAR USUARIO</span>
                </div>

                <div className="p-6 flex flex-col gap-4 text-center">
                    <p className="font-bold">
                        ¿Deseas borrar al usuario _ _ del sistema?
                    </p>
                    <p className="text-sm">
                        Esta acción no podrá ser revertida y perderá acceso a la aplicación móvil también
                    </p>
                </div>

                <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                    <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3]  rounded-lg py-2"
                        onClick={onClose}>
                        <span>Cancelar</span>
                    </button>
                    <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2" onClick={handleDelete}>
                        <span>Borrar</span>
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
}
