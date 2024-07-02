import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import ModalContainer from "@/components/layouts/modal-container";
import { useToast } from "@/components/toasts/use-toasts";
import Image from "next/image";
import { getWarehousePlaces, getWarehouseWaggons, getProducts } from '../../../../../apiDono';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    confirmLoad: (loadData: any) => void;
    warehouses: any[];
    products: any[];
};

type FormData = {
    load_name: string;
    origin: string;
    destination: string;
    products: { name: string, quantity: number }[];
    cash: number;
};

const CreateLoadModal = (props: Props) => {
    const { isOpen, onClose, confirmLoad } = props;
    const { toastSuccess, toastError } = useToast();
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [waggons, setWaggons] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            load_name: "",
            products: [{ name: "", quantity: 0 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "products"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const warehousesData = await getWarehousePlaces();
                const waggonsData = await getWarehouseWaggons();
                const productsData = await getProducts();
                setWarehouses(warehousesData.results);
                setWaggons(waggonsData.results);
                setProducts(productsData.results);
            } catch (error) {
                toastError({ message: "Error al cargar datos" });
            }
        };
        fetchData();
    }, []);

    const onSubmit = (data: FormData) => {
        try {
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
                        <label htmlFor="load_name" className="font-bold text-sm">Nombre de la Carga</label>
                        <input type="text" id="load_name" className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent" {...register("load_name", { required: true })} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="origin" className="font-bold text-sm">Origen</label>
                        <select id="origin" className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent" {...register("origin", { required: true })}>
                            {warehouses.map((warehouse) => (
                                <option key={warehouse.uuid} value={warehouse.uuid}>{warehouse.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="destination" className="font-bold text-sm">Destino</label>
                        <select id="destination" className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent" {...register("destination", { required: true })}>
                            {warehouses.map((warehouse) => (
                                <option key={warehouse.uuid} value={warehouse.uuid}>{warehouse.name}</option>
                            ))}
                            {waggons.map((waggon) => (
                                <option key={waggon.uuid} value={waggon.uuid}>{waggon.name}</option>
                            ))}
                        </select>
                    </div>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex flex-col gap-2">
                            <label className="font-bold text-sm">Producto</label>
                            <select className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent" {...register(`products.${index}.name`, { required: true })}>
                                <option value="">Selecciona un producto</option>
                                {products.map((product) => (
                                    <option key={product.uuid} value={product.uuid}>{product.name}</option>
                                ))}
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
