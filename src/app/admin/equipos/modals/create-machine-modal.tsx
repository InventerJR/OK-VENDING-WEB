'use client';

import { useToast } from '@/components/toasts/use-toasts';
import { FormInput } from "@/components/forms/form-input";
import ImagePicker from "@/components/image-picker";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useState, useEffect, useCallback } from "react";
import CreateAddressMachineModal from "./create-addressmachine-modal";
import { usePageContext } from "../page.context";
import { createWarehouseMachine } from "../../../../../api"; // Asegúrate de ajustar la ruta
import { useAppContext } from '@/hooks/useAppContext';
import { localStorageWrapper } from '@/utils/localStorageWrapper';

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

type Slot = {
    position: number;
    depth: number;
};

type Tray = {
    position: number;
    slots: Slot[];
};

type Product = {
    product_uuid: string;
    stock: number;
    stock_expired: number;
    quantity: number;
};

type FormData = {
    name: string;
    pocket_money: string;
    address: string;
    zipcode: string;
    city_name: string;
    state_name: string;
    lat: number;
    lng: number;
    trays: Tray[];
    productos: Product[];
    image?: File;
}

export default function CreateMachineModal(props: Props) {
    const { loading, setLoading } = useAppContext();
    const { isOpen, onClose } = props;
    const { toastSuccess, toastError } = useToast();
    const { products, addresses, setAddresses, refreshData } = usePageContext();
    const [initialCoords, setInitialCoords] = useState<[number, number]>([21.166984805311472, -101.64569156787444]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<FormData>();

    const { fields: trayFields, append: appendTray, remove: removeTray } = useFieldArray({
        control,
        name: "trays"
    });

    const { fields: productFields, append: appendProduct, remove: removeProduct } = useFieldArray({
        control,
        name: "productos"
    });

    const watchedTrays = watch("trays");
    const productCount = productFields.length;

    const handleSlotsChange = useCallback((traysParam?: Tray[]) => {
        const trays = traysParam ?? watch("trays") ?? [];
        const totalSlots = trays.reduce((acc, tray) => acc + tray.slots.length, 0);
        const currentProducts = productCount;

        if (totalSlots > currentProducts) {
            for (let i = currentProducts; i < totalSlots; i++) {
                appendProduct({ product_uuid: "", stock: 0, stock_expired: 0, quantity: 0 });
            }
        } else if (totalSlots < currentProducts) {
            for (let i = currentProducts; i > totalSlots; i--) {
                removeProduct(i - 1);
            }
        }
    }, [appendProduct, removeProduct, productCount, watch]);

    useEffect(() => {
        handleSlotsChange(watchedTrays || []);
    }, [handleSlotsChange, watchedTrays]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        const trays = data.trays;
        const products = data.productos;

        let productIndex = 0;
        for (let trayIndex = 0; trayIndex < trays.length; trayIndex++) {
            const tray = trays[trayIndex];
            for (let slotIndex = 0; slotIndex < tray.slots.length; slotIndex++) {
                const slot = tray.slots[slotIndex];
                const product = products[productIndex];
                productIndex++;
            }
        }

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("pocket_money", data.pocket_money);
        formData.append("address", data.address);
        formData.append("zipcode", data.zipcode);
        formData.append("city_name", data.city_name);
        formData.append("state_name", data.state_name);
        formData.append("lat", data.lat.toString());
        formData.append("lng", data.lng.toString());

        if (data.image) {
            formData.append("image", data.image);
        }

        // Convertir las bandejas y productos a strings JSON
        const traysJSON = JSON.stringify(data.trays); 
        const productosJSON = JSON.stringify(data.productos);

        // Agregar los strings JSON a FormData
        formData.append("trays", traysJSON); 
        formData.append("productos", productosJSON);
        
        // Convertir FormData a un objeto JSON
        const formDataObject = Object.fromEntries(formData.entries());

        // Imprimir en consola el objeto FormData como JSON
        console.log("formData:", JSON.stringify(formDataObject, null, 2));

        try {
            console.log('Submitting formData:', formData);
            await createWarehouseMachine(formData);
            refreshData();
            toastSuccess({ message: "Se creó la máquina" });
            onClose();
        } catch (error: any) {
            console.error("Error creating warehouse machine:", error);
            toastError({ message: error.message });
        }finally{
            setLoading(false);
        }
    };

    const addAddress = (address: { address: string; lat: number; lng: number; }) => {
        setAddresses([...addresses, address]);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        const selectedAddress = addresses.find(address => address.address === selectedName);
        if (selectedAddress) {
            setValue("lat", selectedAddress.lat);
            setValue("lng", selectedAddress.lng);
            localStorageWrapper.setItem("selectedLat", selectedAddress.lat.toString());
            localStorageWrapper.setItem("selectedLng", selectedAddress.lng.toString());
        }
    };

    const handleProductChange = (index: number, uuid: string) => {
        setValue(`productos.${index}.product_uuid`, uuid);
    };

    useEffect(() => {
        if (isOpen) {
            setValue("lat", 0);
            setValue("name", "");
            setValue("pocket_money","");
            setValue("address", "");
            setValue("zipcode", "");
            setValue("city_name", "");
            setValue("state_name", "");
            setValue("trays", []);
            setValue("productos", []);
            setValue("image", undefined);
        }
    },[isOpen, setValue])

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
                <div className="w-fit self-center  px-8">
                    <span className="text-sl text-[]">Los campos con un '*' son obligartorios</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit, () => {
                    Object.values(errors).forEach(error => {
                        toastError({ message: error.message || "Error en el campo" });
                    });
                    setLoading(false);
                })} className="flex flex-col gap-2 md:gap-4 py-6 px-4 self-center">
                    <ImagePicker register={register} setValue={setValue} />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="type" className="font-bold text-sm">Tipo</label>
                        <select
                            id="input-tipo"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            
                        >
                            <option value="">Sin Tipo</option>
                            <option value="type1">Tipo 1</option>
                        </select>
                        
                    </div>

                    <FormInput<FormData>
                        id={"input-nombre"}
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
                        id={"input-pocket_money"}
                        name={"pocket_money"}
                        label={"Contador de la máquina *"}
                        type='number'
                        placeholder="Ingrese el contador"
                        register={register}
                        rules={{ required: "El contador es requerido" }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.pocket_money && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.pocket_money.message}
                        </p>
                    )}

                    <button
                        type="button"
                        className="w-[150px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2 ml-auto hover:bg-[#58B7A3] hover:text-white"
                        onClick={() => setIsAddressModalOpen(true)}>
                        <span>Agregar dirección </span>
                    </button>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="address" className="font-bold text-sm">Dirección *</label>
                        <select
                            id="input-direccion"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("address", { required: "La dirección es requerida" })}
                            onChange={handleAddressChange}
                        >
                            <option value="">Seleccionar dirección</option>
                            {addresses.map((address, index) => (
                                <option key={index} value={address.address}>{address.address}</option>
                            ))}
                        </select>
                        {errors.address && <span className="text-red-500">{errors.address.message}</span>}
                    </div>

                    <FormInput<FormData>
                        id={"input-codigopostal"}
                        name={"zipcode"}
                        label={"Código postal *"}
                        type='number'
                        placeholder="Ingrese el código postal "
                        register={register}
                        rules={{ required: "El código postal es requerido" }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.zipcode && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.zipcode.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"input-ciudad"}
                        name={"city_name"}
                        label={"Ciudad *"}
                        placeholder="Ingrese la ciudad "
                        register={register}
                        rules={{ required: "La ciudad es requerida" }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.city_name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.city_name.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"input-estado"}
                        name={"state_name"}
                        label={"Estado *"}
                        placeholder="Ingrese el estado"
                        register={register}
                        rules={{ required: "El estado es requerido" }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.state_name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.state_name.message}
                        </p>
                    )}

                    <div className="mt-4">
                        <label className="font-bold text-sm">Bandejas *</label>
                        <br></br>
                        {trayFields.map((tray, trayIndex) => (
                            <div key={tray.id} className="flex flex-col gap-2 mb-4 border border-gray-300 p-4 rounded-lg">
                                <FormInput<FormData>
                                    id={`trays.${trayIndex}.position`}
                                    name={`trays.${trayIndex}.position` as const}
                                    label={`Posición de la bandeja ${trayIndex + 1}`}
                                    type='number'
                                    placeholder="Ingrese la posición de la bandeja"
                                    register={register}
                                    rules={{ required: "La posición de la bandeja es requerida" }}
                                />

                                <div className="ml-6">
                                    <label className="font-bold text-sm">Espacios *</label>
                                    <Controller
                                        control={control}
                                        name={`trays.${trayIndex}.slots` as const}
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                {value.map((slot: Slot, slotIndex: number) => (
                                                    <div key={slotIndex} className="flex gap-2 mb-2">
                                                        <FormInput<FormData>
                                                            id={`trays.${trayIndex}.slots.${slotIndex}.position`}
                                                            name={`trays.${trayIndex}.slots.${slotIndex}.position` as const}
                                                            label={`Posición del espacio ${slotIndex + 1}`}
                                                            type='number'
                                                            placeholder="Ingrese la posición del espacio"
                                                            register={register}
                                                            rules={{ required: "La posición del espacio es requerida" }}
                                                        />
                                                        <FormInput<FormData>
                                                            id={`trays.${trayIndex}.slots.${slotIndex}.depth`}
                                                            name={`trays.${trayIndex}.slots.${slotIndex}.depth` as const}
                                                            label={`Profundidad del espacio ${slotIndex + 1}`}
                                                            type='number'
                                                            placeholder="Ingrese la profundidad del espacio"
                                                            register={register}
                                                            rules={{ required: "La profundidad del espacio es requerida" }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="w-[150px] font-medium border-[2px] border-red-500 bg-red-500 text-[#FFFFFF] rounded-lg py-2 ml-auto"
                                                            onClick={() => {
                                                                const updatedSlots = [...value];
                                                                updatedSlots.splice(slotIndex, 1);
                                                                onChange(updatedSlots);
                                                                handleSlotsChange();
                                                            }}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                ))}
                                                <br />
                                                <button
                                                    type="button"
                                                    className="w-[150px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2 ml-auto hover:bg-[#58B7A3] hover:text-white"
                                                    onClick={() => {
                                                        onChange([...value, { position: 0, depth: 0 }]);
                                                        handleSlotsChange();
                                                    }}
                                                >
                                                    Agregar espacio
                                                </button>
                                            </>
                                        )}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="w-[150px] font-medium border-[2px] border-red-500 bg-red-500 text-[#FFFFFF] rounded-lg py-2 ml-auto"
                                    onClick={() => {
                                        removeTray(trayIndex);
                                        handleSlotsChange();
                                    }}
                                >
                                    Eliminar bandeja
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="w-[150px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2 ml-auto hover:bg-[#58B7A3] hover:text-white"
                            onClick={() => appendTray({ position: trayFields.length + 1, slots: [] })}
                        >
                            Agregar bandeja
                        </button>
                    </div>

                    {/* Sección de Productos */}
                    <div className="mt-4 flex flex-col gap-2">
                        <label className="font-bold text-sm">Productos</label>
                        {productFields.map((product, productIndex) => {
                            let trayNumber = 0;
                            let slotNumber = 0;
                            let count = 0;

                            for (let tray of trayFields) {
                                for (let slot of tray.slots) {
                                    if (count === productIndex) {
                                        trayNumber = tray.position;
                                        slotNumber = slot.position;
                                    }
                                    count++;
                                }
                            }

                            return (
                                <div key={product.id} className="flex flex-col gap-2 mb-4 border border-gray-300 p-4 rounded-lg">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor={`productos.${productIndex}.product_uuid`} className="font-bold text-sm">
                                            Producto (Charola {trayNumber} Espacio {slotNumber} *)
                                        </label>
                                        <select
                                            id={`productos.${productIndex}.product_uuid`}
                                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                                            {...register(`productos.${productIndex}.product_uuid`, { required: "El producto es requerido" })}
                                            onChange={(e) => handleProductChange(productIndex, e.target.value)}
                                        >
                                            <option value="">Seleccionar producto *</option>
                                            {products.map((product) => (
                                                <option key={product.uuid} value={product.uuid}>{product.name}</option>
                                            ))}
                                        </select>
                                        {errors.productos && errors.productos[productIndex] && errors.productos[productIndex]?.product_uuid && (
                                            <span className="text-red-500">{errors.productos[productIndex]?.product_uuid?.message}</span>
                                        )}
                                    </div>
                                    <FormInput<FormData>
                                        id={`productos.${productIndex}.stock`}
                                        name={`productos.${productIndex}.stock` as const}
                                        label={`Stock del producto ${productIndex + 1} *`}
                                        type='number'
                                        placeholder="Ingrese el stock del producto"
                                        register={register}
                                        rules={{ required: "El stock del producto es requerido" }}
                                    />
                                    <FormInput<FormData>
                                        id={`productos.${productIndex}.stock_expired`}
                                        name={`productos.${productIndex}.stock_expired` as const}
                                        label={`Stock expirado del producto ${productIndex + 1} (si es nueva maquina deja el 0)`}
                                        type='number'
                                        placeholder="Ingrese el stock expirado del producto"
                                        register={register}
                                        rules={{ required: "El stock expirado del producto es requerido" }}
                                    />
                                    <FormInput<FormData>
                                        id={`productos.${productIndex}.quantity`}
                                        name={`productos.${productIndex}.quantity` as const}
                                        label={`Cantidad del producto ${productIndex + 1} *`}
                                        type='number'
                                        placeholder="Ingrese la cantidad del producto"
                                        register={register}
                                        rules={{ required: "La cantidad del producto es requerida" }}
                                    />
                                    <button
                                        type="button"
                                        className="w-[150px] font-medium border-[2px] border-red-500 bg-red-500 text-[#FFFFFF] rounded-lg py-2 ml-auto"
                                        onClick={() => {
                                            removeProduct(productIndex);
                                            handleSlotsChange();
                                        }}
                                    >
                                        Eliminar producto
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2" onClick={onClose}>
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
