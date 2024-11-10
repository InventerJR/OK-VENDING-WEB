import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import ImagePicker from "@/components/image-picker";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';
import { useEffect, useState } from "react";
import { updateUser, getUserByUUID } from "../../../../../api";
import { useAppContext } from '@/hooks/useAppContext';
import { localStorageWrapper } from '@/utils/localStorageWrapper';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

type FormData = {
    type: string;
    name: string;
    address: string;
    phone: string;
    salary: number;
    email: string;
    password: string;
    image: File | null;
}

const UpdateUserModal = (props: Props) => {
    const { isOpen, onClose, user } = props;
    const { toastSuccess, toastError } = useToast();
    const { setLoading, refreshUsers } = useAppContext();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [initialImage, setInitialImage] = useState<string | null>(user?.image || null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    useEffect(() => {
        if (user) {
            setValue("type", user.type_user.toString());
            setValue("name", user.first_name);
            setValue("address", user.address);
            setValue("phone", user.phone);
            setValue("salary", user.salary);
            setValue("email", user.email);
            setValue("password", ''); // Clear password field
            setSelectedImage(null); // Reset image
            setInitialImage(user.image || null);
            console.log(user.image) // Set initial image
        }
    }, [user, setValue]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        const uuid = localStorageWrapper.getItem("selectedUserUUID");
        if (!uuid) {
            toastError({ message: "UUID no encontrado en local storage" });
            setLoading(false);
            return;
        }

        const formData = {
            ...data,
            uuid,
            type_user: data.type,
            first_name: data.name,
            second_last_name: user.second_last_name,
            company_uuid: user.company_uuid,
            image: selectedImage
        };

        try {
            console.log("Enviando datos al servidor:", formData);
            await updateUser(formData);
            console.log("Usuario actualizado");

            const updatedUser = await getUserByUUID(uuid);
            setInitialImage(updatedUser.image); // Update initial image with the new one from the server

            toastSuccess({ message: "Se editó el usuario" });
            refreshUsers(); // Refrescar la tabla después de actualizar
            onClose();
            localStorageWrapper.removeItem("selectedUserUUID");
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.Error) {
                toastError({ message: error.response.data.Error });
            } else {
                toastError({ message: "Error al crear el usuario" });
            }
        } finally {
            setLoading(false);
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
                    <span className="font-bold text-xl">EDITAR USUARIO</span>
                </div>

                <div className="w-fit self-center  px-8">
                    <span className="text-sl text-[]">Los campos con un '*' son obligartorios</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit, () => {
                    Object.values(errors).forEach(error => {
                        toastError({ message: error.message || "Error en el campo" });
                    });
                })} className="flex flex-col gap-2 md:gap-4 py-6 px-4 self-center">
                    <ImagePicker register={register} setValue={setValue} initialImage={initialImage} onImageSelect={setSelectedImage} />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="type" className="font-bold text-sm">Tipo de usuario *</label>
                        <select
                            id="type"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("type", { required: true })}
                        >
                            <option value="1">Administrador</option>
                            <option value="2">Supervisor</option>
                            <option value="3">Operador</option>
                        </select>
                    </div>

                    <FormInput<FormData>
                        id={"name"}
                        name={"name"}
                        label={"Nombre *"}
                        placeholder="Ingrese el nombre"
                        register={register}
                        rules={{ required: "El nombre es requerido" }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"address"}
                        name={"address"}
                        label={"Dirección *"}
                        placeholder="Ingrese la dirección"
                        register={register}
                        rules={{ required: "La dirección es requerida" }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.address.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"phone"}
                        name={"phone"}
                        label={"Teléfono *"}
                        placeholder="Ingrese el teléfono"
                        register={register}
                        rules={{
                            required: "El número de teléfono es requerido",
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
                        id={"salary"}
                        name={"salary"}
                        label={"Sueldo mensual *"}
                        placeholder="Ingrese el sueldo"
                        register={register}
                        rules={{
                            required: "El sueldo es requerido",
                            pattern: {
                                value: /^[0-9]*\.?[0-9]*$/,
                                message: "El sueldo solo puede contener números"
                            }
                        }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.salary && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.salary.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"email"}
                        autoComplete="new-password"
                        name={"email"}
                        label={"Correo electrónico *"}
                        placeholder="Ingrese el correo electrónico"
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
                        id={"password"}
                        type="password"
                        autoComplete="new-password"
                        name={"password"}
                        label={"Nueva Contraseña *"}
                        placeholder="Ingrese nueva contraseña"
                        register={register}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}

                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2"
                            onClick={() => {
                                onClose();
                                localStorageWrapper.removeItem("selectedUserUUID");
                            }}>
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
}

export default UpdateUserModal;
