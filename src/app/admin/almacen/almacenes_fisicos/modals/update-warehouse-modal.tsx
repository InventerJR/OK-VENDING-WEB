import { FormInput } from "@/components/forms/form-input";
import Image from "next/image";
import AddressPicker from "@/components/address-picker-update";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';
import { updateWarehousePlace } from "../../../../../../api";
import { usePurchasesAdminContext } from "../purchases-admin.context";
import ModalContainer from "@/components/layouts/modal-container";
import { useEffect, useState, useRef } from "react";
import { useAppContext } from "@/hooks/useAppContext";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    warehouse: any;
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
}

const UpdateWarehouseModal = (props: Props) => {
    const { loading, setLoading } = useAppContext();
    const { isOpen, onClose, warehouse } = props;
    const { toastSuccess, toastError } = useToast();
    const { refreshData } = usePurchasesAdminContext();
    const [initialCoords, setInitialCoords] = useState<[number, number]>([0, 0]);
    const addressPickerRef = useRef<any>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch
    } = useForm<FormData>();

    useEffect(() => {
        if (warehouse) {
            setValue("name", warehouse.name);
            setValue("address", warehouse.address);
            setValue("zipcode", warehouse.zipcode);
            setValue("city_name", warehouse.city_name);
            setValue("state_name", warehouse.state_name);
            setValue("lat", warehouse.lat);
            setValue("lng", warehouse.lng);
            setValue("phone", warehouse.phone);
            setInitialCoords([warehouse.lat, warehouse.lng]);
        }
    }, [warehouse, setValue]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const updatedData = {
                ...data,
                uuid: warehouse.uuid,
            };
            await updateWarehousePlace(updatedData);
            toastSuccess({ message: "Se actualizó el almacén" });
            refreshData(); // Refresca los datos después de actualizar el almacén
            onClose();
        } catch (error: any) {
            toastError({ message: error.message });
        }finally {
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
                    <span className="font-bold text-xl">ACTUALIZAR ALMACÉN</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 xl:gap-6 py-6 px-4 w-full md:max-w-[400px] lg:w-[420px] self-center">
                    <AddressPicker ref={addressPickerRef} setValue={setValue} initialCoords={initialCoords} />
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
                        id={"address"}
                        name={"address"}
                        label={"Dirección"}
                        placeholder="Ingrese la dirección"
                        register={register}
                        rules={{
                            required: "La dirección es requerida"
                        }}
                    />

                    <FormInput<FormData>
                        id={"zipcode"}
                        name={"zipcode"}
                        label={"Código postal"}
                        placeholder="Ingrese el código postal"
                        register={register}
                        rules={{
                            required: "El código postal es requerido"
                        }}
                    />

                    <FormInput<FormData>
                        id={"city_name"}
                        name={"city_name"}
                        label={"Ciudad"}
                        placeholder="Ingrese la ciudad"
                        register={register}
                        rules={{
                            required: "La ciudad es requerida"
                        }}
                    />

                    <FormInput<FormData>
                        id={"state_name"}
                        name={"state_name"}
                        label={"Estado"}
                        placeholder="Ingrese el estado"
                        register={register}
                        rules={{
                            required: "El estado es requerido"
                        }}
                    />

                    <FormInput<FormData>
                        id={"lat"}
                        name={"lat"}
                        label={"Latitud"}
                        placeholder="Ingrese la latitud"
                        register={register}
                        rules={{
                            required: "La latitud es requerida"
                        }}
                        value={watch("lat")?.toString()} // Convert to string
                    />

                    <FormInput<FormData>
                        id={"lng"}
                        name={"lng"}
                        label={"Longitud"}
                        placeholder="Ingrese la longitud"
                        register={register}
                        rules={{
                            required: "La longitud es requerida"
                        }}
                        value={watch("lng")?.toString()} // Convert to string
                    />

                    <FormInput<FormData>
                        id={"phone"}
                        name={"phone"}
                        label={"Número de teléfono"}
                        placeholder="Ingrese el teléfono"
                        register={register}
                        rules={{
                            required: "El teléfono es requerido"
                        }}
                    />

                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2"
                            onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Actualizar Almacen</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
};

export default UpdateWarehouseModal;
