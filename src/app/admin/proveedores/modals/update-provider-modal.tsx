import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import ImagePicker from "@/components/image-picker";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';
import { usePageContext } from '../page.context'; // Importa el contexto adecuado
import { updateSuppliers } from '../../../../../apiDono';
import { useEffect, useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    provider: any;
}

type FormData = {
    name: string;
    phone: string;
    email: string;
    address: string;
}

const UpdateProviderModal = (props: Props) => {
    const { isOpen, onClose, provider } = props;
    const { toastSuccess, toastError } = useToast();
    const { refreshData } = usePageContext(); // Usa el contexto adecuado

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch
    } = useForm<FormData>();

    useEffect(() => {
        if (provider) {
            setValue("name", provider.name);
            setValue("phone", provider.phone);
            setValue("email", provider.email);
            setValue("address", provider.address);
        }
    }, [provider, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            const updatedData = {
                ...data,
                uuid: provider.uuid,
            };
            await updateSuppliers(updatedData);
            toastSuccess({ message: "Se actualizó el proveedor" });
            refreshData(); // Refresca los datos después de actualizar el proveedor
            onClose();
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.Error) {
                toastError({ message: error.response.data.Error });
            } else {
                toastError({ message: "Error al crear el proveedor" });
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
                    <span className="font-bold text-xl">EDITAR PROVEEDOR</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit, () => {
                    Object.values(errors).forEach(error => {
                        toastError({ message: error.message || "Error en el campo" });
                    });
                })} className="flex flex-col gap-2 md:gap-4 py-6 px-4 self-center">
                    <ImagePicker register={register} setValue={setValue} />

                    {/* text input  */}
                    <FormInput<FormData>
                        id={"name-id"}
                        name={"name"}
                        label={"Nombre"}
                        placeholder="Ingrese nombre del proveedor"
                        register={register}
                        rules={{
                            required: "El nombre es requerido"
                        }}
                    />
                    <FormInput<FormData>
                        id={"phone-id"}
                        name={"phone"}
                        label={"Teléfono"}
                        placeholder="Ingrese número celular"
                        register={register}
                        rules={{
                            required: "El número de telefono es requerido",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "El número de teléfono solo puede contener números"
                            }
                        }}
                    />
                    <FormInput<FormData>
                        id={"email-id"}
                        name={"email"}
                        label={"Correo"}
                        placeholder="Ingrese el correo del proveedor"
                        register={register}
                        rules={{
                            required: "El correo es requerido",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Correo inválido"
                            }
                        }}
                    />
                    <FormInput<FormData>
                        id={"address-id"}
                        name={"address"}
                        label={"Dirección"}
                        placeholder="Ingrese la dirección"
                        register={register}
                        rules={{
                            required: "La dirección es requerida"
                        }}
                    />

                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2"
                            onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Actualizar</span>
                        </button>
                    </div>
                </form>

            </div>
        </ModalContainer>
    );
};

export default UpdateProviderModal;
