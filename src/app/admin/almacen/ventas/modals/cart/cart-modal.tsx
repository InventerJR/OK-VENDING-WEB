import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { CartContextProvider, useCartContext } from "./cart.context";
import CartDataTable from "./cart-table/data-table";
import axios from "axios";
import { CONSTANTS } from '@/constants';
import { getAPIToken } from '../../../../../../../src/utils/Auth'; // Ajusta la ruta según sea necesario
import { localStorageWrapper } from '@/utils/localStorageWrapper';

///const API_BASE_URL_DOS = 'http://192.168.100.10:8000/api'; // Ajusta esta URL según tu configuración

type Props = {
    isOpen: boolean;
    onClose: () => void;

}

type FormData = {
    value1: string;
    value2: string;
}

function CartModalView(props: Props) {
    const { isOpen, onClose } = props;
    const { products, quantities } = useCartContext();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        // Implement the logic to save the purchase
    };

    const onSave = async () => {
        try {
            const warehouseUUID = localStorageWrapper.getItem('selectedWarehouse');
            if (!warehouseUUID) {
                throw new Error("No warehouse selected");
            }

            const [token] = getAPIToken();
            if (!token) {
                throw new Error("No token found, please log in again.");
            }

            for (const product of products) {
                const quantity = quantities[product.product.id];
                if (quantity) {
                    const payload = {
                        product_uuid: product.product.uuid,
                        quantity,
                        warehouse_place_uuid: warehouseUUID, // Cambiado a warehouse_place_uuid
                    };

                    await axios.post(`${CONSTANTS.API_BASE_URL}/inventories/manual_sale/`, payload, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `JWT ${ token }`
                        }
            });
        }
            }

    alert("Venta manual completada exitosamente");
    onClose(); // Cierra el modal al completar
} catch (error) {
    console.error("Error al confirmar la venta manual:", error);
    alert("Error al confirmar la venta manual");
}
    }

return (
    <ModalContainer visible={isOpen} onClose={onClose} auto_width={false}>
        <div className="flex flex-col gap-2 p-6 relative self-center justify-self-center w-[80vw] sm:w-[70vw] md:w-[60vw]">
            <div className="absolute right-3 top-6">
                <button className="font-bold font-sans p-3 -m-3" onClick={onClose}>
                    <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                </button>
            </div>
            <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                <span className="font-bold text-xl">VENTAS</span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row gap-4 xl:gap-6 py-6 px-4 w-full self-center">
                {/* Añadir otros elementos del formulario aquí */}
            </form>

            <div className="min-h-[200px] max-w-full overflow-auto">
                <CartDataTable />
            </div>

            <div className="flex flex-col gap-2 w-full items-center py-12">
                <button className="border border-[#58B7A3] text-[#58B7A3] rounded-lg py-2 px-4 w-fit" onClick={() => { /* Añadir lógica para agregar otro producto */ }}>Agregar otro producto</button>
            </div>

            <div className="flex flex-row gap-4 ml-[40%]">
                <button className="text-[#58B7A3] border border-[#58B7A3] rounded-lg py-2 px-4 w-full" onClick={onClose}>Cerrar</button>
                <button className="bg-[#58B7A3] text-white rounded-lg py-2 px-4 w-full" onClick={onSave}>Guardar</button>
            </div>
        </div>
    </ModalContainer>
);
}

export default function CartModal(props: Props) {
    return (
        <CartContextProvider>
            <CartModalView {...props} />
        </CartContextProvider>
    );
}