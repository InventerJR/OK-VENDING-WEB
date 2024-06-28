import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';
import { registerBrand } from '../../../../../api_categories_products'; // Asegúrate de ajustar la ruta
import { usePageContext } from "../page.context";
type Props = {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    name: string;
    description: string;
}

const CreateBrandModal = (props: Props) => {
    const { isOpen, onClose } = props;
    const { toastSuccess, toastError } = useToast();
    const { refreshData } = usePageContext();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            await registerBrand(data);

            toastSuccess({ message: "Se creó la marca correctamente" });
            onClose(); // Cerrar el modal al finalizar
            refreshData();
        } catch (error: any) {
            toastError({ message: error.message });
        }
    };

    return (
        <ModalContainer visible={isOpen} onClose={onClose} auto_width={false}>
            <div className="flex flex-col p-6 relative max-w-screen-sm self-center justify-self-center w-[80vw] md:w-[60vw] md:max-w-[620px]">
                <div className="absolute right-3 top-6">
                    <button className="font-bold font-sans p-3 -m-3" onClick={onClose}>
                        <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                    </button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">CREAR MARCA</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 xl:gap-6 py-6 px-4 w-full md:max-w-[400px] lg:w-[420px] self-center">

                    <FormInput<FormData>
                        id={"name"}
                        name={"name"}
                        label={"Nombre"}
                        placeholder="Ingrese el nombre de la marca"
                        register={register}
                        rules={{
                            required: "El nombre es requerido"
                        }}
                    />

                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2"
                            onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Crear Marca</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
}

export default CreateBrandModal;
