import AddressPicker from "@/components/address-picker";
import { useForm } from "react-hook-form";
import ModalContainer from "@/components/layouts/modal-container";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    addAddress: (address: any) => void;
}

type FormData = {
    name: string;
    lat: number;
    lng: number;
}

const CreateAddressMachineModal = (props: Props) => {
    const { isOpen, onClose, addAddress } = props;
    const [markerPosition, setMarkerPosition] = useState<[number, number]>([34.0522, -118.2437]);
    const markerRef = useRef<any>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        const { name } = data;
        const lat = markerPosition[0];
        const lng = markerPosition[1];
        addAddress({ name, lat, lng });
        onClose();
    };

    const handleDragEnd = () => {
        const marker = markerRef.current;
        if (marker != null) {
            const { lat, lng } = marker.getLatLng();
            setMarkerPosition([lat, lng]);
            setValue("lat", lat);
            setValue("lng", lng);
        }
    };

    useEffect(() => {
        setValue("lat", markerPosition[0]);
        setValue("lng", markerPosition[1]);
    }, [markerPosition, setValue]);

    return (
        <ModalContainer visible={isOpen} onClose={onClose} auto_width={false}>
            <div className="flex flex-col p-6 relative max-w-screen-sm self-center justify-self-center w-[80vw] md:w-[60vw] md:max-w-[620px]">
                <div className="absolute right-3 top-6">
                    <button className="font-bold font-sans p-3 -m-3" onClick={onClose}>
                        <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                    </button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">AGREGAR MAPA</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 xl:gap-6 py-6 px-4 w-full md:max-w-[400px] lg:w-[420px] self-center">
                    <div className="w-full h-[300px]">
                        <AddressPicker setValue={setValue} initialCoords={markerPosition} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="font-bold text-sm">Escribe el nombre de la ubicación</label>
                        <input
                            id="name"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("name", { required: "El nombre es requerido" })}
                        />
                        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                    </div>
                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2" onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Agregar Dirección</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
};

export default CreateAddressMachineModal;
