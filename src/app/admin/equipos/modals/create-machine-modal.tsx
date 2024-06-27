import AddressPicker from "@/components/address-picker";
import { FormInput } from "@/components/forms/form-input";
import ImagePicker from "@/components/image-picker";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState } from "react";
import CreateAddressMachineModal from "./create-addressmachine-modal";
import { usePageContext } from "../page.context";
import { createWarehouseMachine } from "../../../../../api"; // Asegúrate de ajustar la ruta

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    name: string;
    pocket_money: string;
    address: string;
    zipcode: string;
    city_name: string;
    state_name: string;
    lat: number;
    lng: number;
    trays: { position: number; slots: { position: number; depth: number; }[]; }[];
    productos: { product_uuid: string; stock: number; stock_expired: number; quantity: number; }[];
    image: FileList;
}

export default function CreateMachineModal(props: Props) {
    const { isOpen, onClose } = props;
    const [initialCoords, setInitialCoords] = useState<[number, number]>([21.166984805311472, -101.64569156787444]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addresses, setAddresses] = useState<{ name: string; lat: number; lng: number; }[]>([]);
    const { refreshData } = usePageContext();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("pocket_money", data.pocket_money);
        formData.append("address", data.address);
        formData.append("zipcode", data.zipcode);
        formData.append("city_name", data.city_name);
        formData.append("state_name", data.state_name);
        formData.append("lat", data.lat.toString());
        formData.append("lng", data.lng.toString());

        if (data.image && data.image[0]) {
            formData.append("image", data.image[0]);
        }

        formData.append("trays", JSON.stringify(data.trays));
        formData.append("productos", JSON.stringify(data.productos));

        try {
            await createWarehouseMachine(formData);
            refreshData();
            onClose();
        } catch (error) {
            console.error("Error creating warehouse machine:", error);
        }
    };

    const addAddress = (address: { name: string; lat: number; lng: number; }) => {
        setAddresses([...addresses, address]);
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
                    <span className="font-bold text-xl">CREAR MÁQUINA</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 xl:gap-6 py-6 px-4 w-full md:max-w-[400px] lg:w-[420px] self-center">
                    <ImagePicker register={register} setValue={setValue} />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="type" className="font-bold text-sm">Tipo</label>
                        <select
                            id="input-tipo"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("pocket_money", { required: "El tipo es requerido" })}
                        >
                            <option value="">Sin Tipo</option>
                            <option value="type1">Tipo 1</option>
                        </select>
                        {errors.pocket_money && <span className="text-red-500">{errors.pocket_money.message}</span>}
                    </div>

                    <FormInput<FormData>
                        id={"input-nombre"}
                        name={"name"}
                        label={"Nombre"}
                        placeholder="Ingrese el nombre"
                        register={register}
                        rules={{ required: "El nombre es requerido" }}
                    />

                    <FormInput<FormData>
                        id={"input-pocket_money"}
                        name={"pocket_money"}
                        label={"Contador de la máquina"}
                        placeholder="Ingrese el contador"
                        register={register}
                        rules={{ required: "El contador es requerido" }}
                    />

                    <button
                        type="button"
                        className="w-[150px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2 ml-auto hover:bg-[#58B7A3] hover:text-white"
                        onClick={() => setIsAddressModalOpen(true)}>
                        <span>Agregar dirección</span>
                    </button>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="address" className="font-bold text-sm">Dirección</label>
                        <select
                            id="input-direccion"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("address", { required: "La dirección es requerida" })}
                        >
                            <option value="">Seleccionar dirección</option>
                            {addresses.map((address, index) => (
                                <option key={index} value={address.name}>{address.name}</option>
                            ))}
                        </select>
                        {errors.address && <span className="text-red-500">{errors.address.message}</span>}
                    </div>

                    <FormInput<FormData>
                        id={"input-codigopostal"}
                        name={"zipcode"}
                        label={"Código postal"}
                        placeholder="Ingrese el código postal"
                        register={register}
                        rules={{ required: "El código postal es requerido" }}
                    />

                    <FormInput<FormData>
                        id={"input-ciudad"}
                        name={"city_name"}
                        label={"Ciudad"}
                        placeholder="Ingrese la ciudad"
                        register={register}
                        rules={{ required: "La ciudad es requerida" }}
                    />

                    <FormInput<FormData>
                        id={"input-estado"}
                        name={"state_name"}
                        label={"Estado"}
                        placeholder="Ingrese el estado"
                        register={register}
                        rules={{ required: "El estado es requerido" }}
                    />

                    <FormInput<FormData>
                        id={"input-numerocharolas"}
                        name={"trays[0].position"}
                        label={"Número de charolas"}
                        placeholder="Ingrese el número de charolas"
                        register={register}
                        rules={{ required: "El número de charolas es requerido" }}
                    />

                    <FormInput<FormData>
                        id={"input-numeroespacioscharolas"}
                        name={"trays[0].slots[0].position"}
                        label={"Número de espacios por charola"}
                        placeholder="Ingrese el número de espacios de charola"
                        register={register}
                        rules={{ required: "El número de espacios por charola es requerido" }}
                    />

                    <FormInput<FormData>
                        id={"input-profundidadcharola"}
                        name={"trays[0].slots[0].depth"}
                        label={"Profundidad de la charola"}
                        placeholder="Ingrese la profundidad de la charola"
                        register={register}
                        rules={{ required: "La profundidad de la charola es requerida" }}
                    />

                    <FormInput<FormData>
                        id={"input-espacioslinea"}
                        name={"productos[0].quantity"}
                        label={"Espacios por línea"}
                        placeholder="Ingrese los espacios por línea"
                        register={register}
                        rules={{ required: "Los espacios por línea son requeridos" }}
                    />

                    <FormInput<FormData>
                        id={"input-posiblestock"}
                        name={"productos[0].stock"}
                        label={"Posible STOCK"}
                        placeholder="Ingrese el posible stock"
                        register={register}
                        rules={{ required: "El posible stock es requerido" }}
                    />

                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2"
                            onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Crear máquina</span>
                        </button>
                    </div>
                </form>

                {isAddressModalOpen && (
                    <CreateAddressMachineModal
                        isOpen={isAddressModalOpen}
                        onClose={() => setIsAddressModalOpen(false)}
                        addAddress={addAddress}
                    />
                )}
            </div>
        </ModalContainer>
    );
}
