import { FormInput } from "@/components/forms/form-input";
import AddressPicker from "@/components/address-picker-create";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';
import { createWarehousePlace, getUsers } from "../../../../../../api";
import { usePurchasesAdminContext } from "../purchases-admin.context";
import ModalContainer from "@/components/layouts/modal-container";
import { useRef, useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    name: string;
    address: string;
    zipcode: string;
    city_name: string;
    state_name: string;
    lat: number;
    lng: number;
    phone: string;
    almacenista_uuid: string;
}

const CreateWarehouseModal = (props: Props) => {
    const { isOpen, onClose } = props;
    const { toastSuccess, toastError } = useToast();
    const { refreshData } = usePurchasesAdminContext();
    const { loading, setLoading } = useAppContext();
    const [users, setUsers] = useState<{ uuid: string, first_name: string, last_name: string }[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormData>();

    const addressPickerRef = useRef<any>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchUsers = async () => {
                try {
                    const data = await getUsers();
                    const type3Users = data.results.filter((user: any) => user.type_user === 4);
                    setUsers(type3Users);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchUsers();
        }
    }, [isOpen]);

    useEffect(() => {
        if (addressPickerRef.current) {
            const position = addressPickerRef.current.getPosition();
            setValue("lat", position[0]);
            setValue("lng", position[1]);
        }
    }, [isOpen, setValue]);

    const onSubmit = async (data: FormData) => {
        console.log("Datos enviados al backend:", data);
        setLoading(true);
        try {
            await createWarehousePlace(data);
            toastSuccess({ message: "Se creó el almacén" });
            refreshData(); // Refresca los datos después de crear el almacén
            onClose();
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.Error) {
                toastError({ message: error.response.data.Error });
            } else {
                toastError({ message: "Error al crear el almacén" });
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
                    <span className="font-bold text-xl">CREAR ALMACÉN</span>
                </div>
                <div className="w-fit self-center  px-8">
                    <span className="text-sl text-[]">Los campos con un '*' son obligartorios</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit, () => {
                    Object.values(errors).forEach(error => {
                        toastError({ message: error.message || "Error en el campo" });
                    });
                })} className="flex flex-col gap-2 md:gap-4 py-6 px-4 self-center">
                    <AddressPicker ref={addressPickerRef} setValue={setValue} />
                    <FormInput<FormData>
                        id={"name"}
                        name={"name"}
                        label={"Nombre *"}
                        placeholder="Ingrese el nombre"
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
                        id={"address"}
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

                    <FormInput<FormData>
                        id={"zipcode"}
                        name={"zipcode"}
                        label={"Código postal *"}
                        placeholder="Ingrese el código postal"
                        register={register}
                        rules={{
                            required: "El código postal es requerido"
                        }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.zipcode && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.zipcode.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"city_name"}
                        name={"city_name"}
                        label={"Ciudad *"}
                        placeholder="Ingrese la ciudad"
                        register={register}
                        rules={{
                            required: "La ciudad es requerida"
                        }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.city_name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.city_name.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"state_name"}
                        name={"state_name"}
                        label={"Estado *"}
                        placeholder="Ingrese el estado"
                        register={register}
                        rules={{
                            required: "El estado es requerido"
                        }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.state_name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.state_name.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"lat"}
                        name={"lat"}
                        label={"Latitud *"}
                        placeholder="Ingrese la latitud"
                        register={register}
                        rules={{
                            required: "La latitud es requerida"
                        }}
                        value={watch("lat")?.toString()} // Convert to string
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.lat && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.lat.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"lng"}
                        name={"lng"}
                        label={"Longitud *"}
                        placeholder="Ingrese la longitud"
                        register={register}
                        rules={{
                            required: "La longitud es requerida"
                        }}
                        value={watch("lng")?.toString()} // Convert to string
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.lng && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.lng.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"phone"}
                        name={"phone"}
                        label={"Número de teléfono *"}
                        placeholder="Ingrese el teléfono"
                        register={register}
                        rules={{
                            required: "El teléfono es requerido"
                        }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.phone.message}
                        </p>
                    )}

                    <div className="flex flex-col gap-4">
                        <label htmlFor="driver_uuid" className="font-medium text-sm">Almacenista</label>
                        <select
                            id="almacenista_uuid"
                            {...register("almacenista_uuid", { required: "El almacenista es requerido" })}
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                        >
                            <option value="">Seleccione un almacenista</option>
                            {users.map(user => (
                                <option key={user.uuid} value={user.uuid}>{`${user.first_name} ${user.last_name}`}</option>
                            ))}
                        </select>
                        {errors.almacenista_uuid && <span className="text-red-500 text-xs">{errors.almacenista_uuid.message}</span>}
                    </div>

                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2"
                            onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Crear Almacén</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
};

export default CreateWarehouseModal;