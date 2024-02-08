import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

export default function DeleteIncidentModal(props: Props) {
    const { isOpen, onClose } = props;
    return (
        <ModalContainer visible={isOpen} onClose={onClose}>
            <div className="flex flex-col p-6 relative">
                <div className="absolute right-4 top-6">
                    <button className="font-bold font-sans p-3 -m-3" onClick={onClose}>
                        <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                    </button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">ELIMINAR</span>
                </div>

                <div className="p-6 flex flex-col gap-4 text-center">

                    <p className="font-bold">
                        ¿Deseas borrar ##el valor## del sistema?
                    </p>


                    {/* <p className="text-sm">
                        Esta acción no podrá ser revertida y perderá acceso a la aplicación móvil también
                    </p> */}
                </div>

                <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                    <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3]  rounded-lg py-2"
                        onClick={onClose}>
                        <span>Cancelar</span>
                    </button>
                    <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                        <span>Borrar</span>
                    </button>
                </div>

            </div>
        </ModalContainer>
    );
}