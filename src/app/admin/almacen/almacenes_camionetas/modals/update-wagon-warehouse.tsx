import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';
import { updateWarehouseWaggon, getUsers } from '../../../../../../api'; // Ajusta la ruta según sea necesario
import { useEffect, useState } from "react";
import { useSalesAdminContext } from "../sales-admin.context"; // Importa el contexto
import { useAppContext } from "@/hooks/useAppContext";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    wagon: any;
}

type FormData = {
    plate: string;
    last_service_date: string;
    tank: number;
    consumption: number;
    mileage: number;
    cash: number;
    insurance_end_date: string;
    driver_uuid: string;
}

const UpdateWagonWarehouseModal = (props: Props) => {
    const { loading, setLoading } = useAppContext();
    const { isOpen, onClose, wagon } = props;
    const { toastSuccess, toastError } = useToast();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
    const [users, setUsers] = useState<{ uuid: string, first_name: string, last_name: string }[]>([]);
    const { refreshData } = useSalesAdminContext(); // Añadir el método refreshData del contexto

    useEffect(() => {
        if (isOpen) {
            const fetchUsers = async () => {
                try {
                    const data = await getUsers();
                    const type3Users = data.results.filter((user: any) => user.type_user === 3);
                    setUsers(type3Users);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchUsers();
        }
    }, [isOpen]);

    useEffect(() => {
        if (wagon) {
            setValue("plate", wagon.plate);
            setValue("last_service_date", wagon.last_service_date);
            setValue("tank", wagon.tank);
            setValue("consumption", wagon.consumption);
            setValue("mileage", wagon.mileage);
            setValue("cash", wagon.cash);
            setValue("insurance_end_date", wagon.insurance_end_date);
            setValue("driver_uuid", wagon.driver_uuid);
        }
    }, [wagon, setValue]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const updatedData = {
                ...data,
                uuid: localStorage.getItem('selectedWagonUUID'), // Obtén el UUID del localStorage
            };
            await updateWarehouseWaggon(updatedData);
            toastSuccess({ message: "Se actualizó la camioneta" });
            refreshData(); // Refresca los datos después de actualizar la camioneta
            localStorage.removeItem('selectedWagonUUID');
            onClose();
        } catch (error: any) {
            toastError({ message: error.message });
        }finally{
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
                    <span className="font-bold text-xl">EDITAR CAMIONETA</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 xl:gap-6 py-6 px-4 w-full md:max-w-[400px] lg:w-[420px] self-center">
                    <FormInput<FormData>
                        id={"plate"}
                        name={"plate"}
                        label={"Placa"}
                        placeholder="Ingrese la placa"
                        register={register}
                        rules={{
                            required: "La placa es requerida"
                        }}
                    />
                    <FormInput<FormData>
                        id={"last_service_date"}
                        name={"last_service_date"}
                        label={"Último servicio"}
                        placeholder="Ingrese la fecha"
                        register={register}
                        rules={{
                            required: "La fecha es requerida"
                        }}
                    />
                    <FormInput<FormData>
                        id={"tank"}
                        name={"tank"}
                        label={"Tanque de la camioneta"}
                        placeholder="Ingrese los litros"
                        register={register}
                        rules={{
                            required: "Los litros son requeridos",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />
                    <FormInput<FormData>
                        id={"consumption"}
                        name={"consumption"}
                        label={"Consumo"}
                        placeholder="Ingrese el consumo"
                        register={register}
                        rules={{
                            required: "El consumo es requerido",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />
                    <FormInput<FormData>
                        id={"mileage"}
                        name={"mileage"}
                        label={"Kilometraje"}
                        placeholder="Ingrese el kilometraje"
                        register={register}
                        rules={{
                            required: "El kilometraje es requerido",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />
                    <FormInput<FormData>
                        id={"cash"}
                        name={"cash"}
                        label={"Dinero"}
                        placeholder="Ingrese la cantidad de dinero"
                        register={register}
                        rules={{
                            required: "El dinero es requerido",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />
                    <FormInput<FormData>
                        id={"insurance_end_date"}
                        name={"insurance_end_date"}
                        label={"Vencimiento del seguro"}
                        placeholder="Ingrese la fecha"
                        register={register}
                        rules={{
                            required: "La fecha es requerida",
                        }}
                    />
                    <div className="flex flex-col gap-4">
                        <label htmlFor="driver_uuid" className="font-medium text-sm">Conductor</label>
                        <select 
                            id="driver_uuid" 
                            {...register("driver_uuid", { required: "El conductor es requerido" })}
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                        >
                            <option value="">Seleccione un conductor</option>
                            {users.map(user => (
                                <option key={user.uuid} value={user.uuid}>{`${user.first_name} ${user.last_name}`}</option>
                            ))}
                        </select>
                        {errors.driver_uuid && <span className="text-red-500 text-xs">{errors.driver_uuid.message}</span>}
                    </div>
                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2" onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Actualizar Camioneta</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
};

export default UpdateWagonWarehouseModal;
