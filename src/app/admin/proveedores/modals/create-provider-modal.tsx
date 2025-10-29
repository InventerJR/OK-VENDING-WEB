import { FormInput } from "@/components/forms/form-input";
import ImagePicker from "@/components/image-picker";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';
import { createSuppliers } from '../../../../../api';
import { usePageContext } from "../page.context";
import { useRef, useEffect, useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    name: string;
    phone: string;
    email: string;
    address: string;
    image: string;
}

export default function CreateProviderModal(props: Props) {
    const { isOpen, onClose } = props;
    const { toastSuccess, toastError } = useToast();
    const { refreshData } = usePageContext();
    const imagePickerRef = useRef<any>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<FormData>();

    const handleClose = () => {
        reset(); // Limpia los campos al cerrar el modal
        onClose();
    };

    useEffect(() => {
        if (imagePickerRef.current) {
            const image = imagePickerRef.current.getImage();
            setValue("image", image);
        }
    }, [isOpen, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            await createSuppliers(data);
            toastSuccess({ message: "Se creó el proveedor" });
            refreshData(); // Refresca los datos después de crear el proveedor
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
                    <button className="font-bold font-sans p-3 -m-3" onClick={handleClose}>
                        <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                    </button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">CREAR PROVEEDOR</span>
                </div>
                <div className="w-fit self-center  px-8">
                    <span className="text-sl text-[] ">Los campos con un '*' son obligartorios</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit, () => {
                    Object.values(errors).forEach(error => {
                        toastError({ message: error.message || "Error en el campo" });
                    });
                })} className="flex flex-col gap-2 md:gap-4 py-6 px-4 self-center">
                    <ImagePicker register={register} setValue={setValue} />

                    <FormInput<FormData>
                        id={"name-id"}
                        name={"name"}
                        label={"Nombre *"}
                        placeholder="Ingrese nombre del proveedor"
                        register={register}
                        rules={{
                            required: "El nombre es requerido"
                        }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"phone-id"}
                        name={"phone"}
                        label={"Teléfono *"}
                        type="number"
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

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.phone.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"email-id"}
                        name={"email"}
                        label={"Correo *"}
                        type="email"
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

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"address-id"}
                        name={"address"}
                        label={"Dirección *"}
                        placeholder="Ingrese la dirección"
                        register={register}
                        rules={{
                            required: "La dirección es requerida"
                        }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.address.message}
                        </p>
                    )}

                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3]  rounded-lg py-2"
                            onClick={handleClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[136px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Crear Proveedor</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
}
