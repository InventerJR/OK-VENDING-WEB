import { FormInput } from "@/components/forms/form-input";
import AddressPicker from "@/components/address-picker";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';
import { createWarehousePlace } from "../../../../../../api";
import { usePurchasesAdminContext } from "../purchases-admin.context";
import ModalContainer from "@/components/layouts/modal-container";
import { useRef, useEffect, useState } from "react";

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
}

const CreateWarehouseModal = (props: Props) => {
    const { isOpen, onClose } = props;
    const { toastSuccess, toastError } = useToast();
    const { refreshData } = usePurchasesAdminContext();
    const [initialCoords, setInitialCoords] = useState<[number, number]>([21.166984805311472, -101.64569156787444]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormData>();

    const addressPickerRef = useRef<any>(null);

    useEffect(() => {
        if (addressPickerRef.current) {
            const position = addressPickerRef.current.getPosition();
            setValue("lat", position[0]);
            setValue("lng", position[1]);
        }
    }, [isOpen, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            await createWarehousePlace(data);
            toastSuccess({ message: "Se creó el almacén" });
            refreshData(); // Refresca los datos después de crear el almacén
            onClose();
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
                    <span className="font-bold text-xl">CREAR ALMACÉN</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 xl:gap-6 py-6 px-4 w-full md:max-w-[400px] lg:w-[420px] self-center">
                    <AddressPicker initialCoords={initialCoords} setValue={setValue} />
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
                            <span>Crear Almacén</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
};

export default CreateWarehouseModal;
