import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';
import { useEffect } from "react";
import { useContextCategory } from '../page.context';
import { updateCategory } from '../../../../../api_categories_products';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    category: any; // La categoría seleccionada para editar
}

type FormData = {
    name: string;
    description: string;
}

export default function UpdateCategoryModal(props: Props) {
    const { isOpen, onClose, category } = props;
    const { toastSuccess, toastError } = useToast();
    const { refreshData } = useContextCategory();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormData>();

    useEffect(() => {
        if (category) {
            setValue("name", category.name);
            setValue("description", category.description);
        }
    }, [category, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            const updatedData = {
                ...data,
                uuid: category.uuid,
            };
            await updateCategory(updatedData);
            toastSuccess({ message: "Se actualizó la categoría correctamente" });
            refreshData(); // Refresca los datos después de actualizar la categoría
            onClose();
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.Error) {
                toastError({ message: error.response.data.Error });
            } else {
                toastError({ message: "Error al editar la categoria" });
            }
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
                    <span className="font-bold text-xl">ACTUALIZAR CATEGORÍA</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit, () => {
                    Object.values(errors).forEach(error => {
                        toastError({ message: error.message || "Error en el campo" });
                    });
                })} className="flex flex-col gap-2 md:gap-4 py-6 px-4 self-center">
                    <FormInput<FormData>
                        id={"name"}
                        name={"name"}
                        label={"Nombre"}
                        placeholder="Ingrese el nombre"
                        register={register}
                        rules={{
                            required: "El nombre es requerido"
                        }}
                    />

                    <FormInput<FormData>
                        id={"description"}
                        name={"description"}
                        label={"Descripción"}
                        placeholder="Ingrese la descripción"
                        register={register}
                        rules={{
                            required: "La descripción es requerida"
                        }}
                    />

                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2"
                            onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Actualizar Categoría</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
};
