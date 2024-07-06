import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useToast } from '@/components/toasts/use-toasts';
import { usePageContext } from '../page.context';
import { deleteBrand } from '../../../../../api_categories_products';
import { useEffect } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    brand: any; // La marca seleccionada para eliminar
}

const DeleteBrandModal = (props: Props) => {
    const { isOpen, onClose, brand } = props;
    const { toastSuccess, toastError } = useToast();
    const { refreshData } = usePageContext();

    useEffect(() => {
        if (isOpen && brand && brand.uuid) {
            console.log("Guardando UUID en localStorage:", brand.uuid);
            localStorage.setItem('selectedBrandUUID', brand.uuid);
        }
    }, [isOpen, brand]);

    const handleDelete = async () => {
        try {
            const uuid = localStorage.getItem('selectedBrandUUID');
            if (!uuid) {
                throw new Error("UUID de la marca no encontrado");
            }
            console.log("Eliminando marca con UUID:", uuid);
            await deleteBrand({ uuid });
            toastSuccess({ message: "Marca eliminada correctamente" });
            localStorage.removeItem('selectedBrandUUID'); // Elimina el UUID del localStorage
            refreshData();
            onClose();
        } catch (error: any) {
            toastError({ message: error.message });
        }
    };

    const handleClose = () => {
        localStorage.removeItem('selectedBrandUUID'); // Elimina el UUID del localStorage
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
                    <span className="font-bold text-xl">ELIMINAR MARCA</span>
                </div>

                <div className="p-6 flex flex-col gap-4 text-center">
                    <p className="font-bold">
                        ¿Deseas borrar la marca {brand?.name} del sistema?
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

export default DeleteBrandModal;