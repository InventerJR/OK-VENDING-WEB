import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import { useToast } from "@/components/toasts/use-toasts";
import Image from "next/image";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    confirmLoad: (loadData: any) => void;
}

type FormData = {
    origin: string;
    destination: string;
    products: { name: string, quantity: number }[];
    cash: number;
}

const CreateLoadModal = (props: Props) => {
    const { isOpen, onClose, confirmLoad } = props;
    const { toastSuccess, toastError } = useToast();
    const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            products: [{ name: "", quantity: 0 }]
        }
    });

    

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products"
    });

    const onSubmit = (data: FormData) => {
        try {
            // Asegúrate de que la propiedad 'products' exista en el objeto 'data'
            confirmLoad(data); 
            toastSuccess({ message: "Resumen de la carga creado" });
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
                    <span className="font-bold text-xl">NUEVA CARGA</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 xl:gap-6 py-6 px-4 w-full md:max-w-[400px] lg:w-[420px] self-center">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="origin" className="font-bold text-sm">Origen</label>
                        <select id="origin" className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent" {...register("origin", { required: true })}>
                            <option value="Almacen Fisico">Almacen Fisico</option>
                            <option value="Almacen Camioneta">Almacen Camioneta</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="destination" className="font-bold text-sm">Destino</label>
                        <select id="destination" className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent" {...register("destination", { required: true })}>
                            <option value="Almacen Fisico">Almacen Fisico</option>
                            <option value="Almacen Camioneta">Almacen Camioneta</option>
                        </select>
                    </div>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex flex-col gap-2">
                            <label className="font-bold text-sm">Producto</label>
                            <select className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent" {...register(`products.${index}.name`, { required: true })}>
                                <option value="">Selecciona un producto</option>
                                <option value="Producto 1">Producto 1</option>
                                <option value="Producto 2">Producto 2</option>
                            </select>
                            <label className="font-bold text-sm">Cantidad</label>
                            <input type="number" className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent" {...register(`products.${index}.quantity`, { required: true, min: 1 })} />
                            <button type="button" className="mt-2 bg-red-500 text-white py-1 px-4 rounded" onClick={() => remove(index)}>Eliminar Producto</button>
                        </div>
                    ))}
                    <button type="button" className="mt-4 bg-green-500 text-white py-2 px-4 rounded" onClick={() => append({ name: "", quantity: 0 })}>Agregar Producto</button>
                    <div className="flex flex-col gap-2 mt-4">
                        <label htmlFor="cash" className="font-bold text-sm">Efectivo</label>
                        <input type="number" id="cash" className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent" {...register("cash", { required: true, min: 0 })} />
                    </div>
                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2" onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Crear carga</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
};

export default CreateLoadModal;
