import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useEffect } from "react";
import { loadWaggon } from '../../../../../apiDono';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    loadData: any;
    warehouses: any[];
    products: any[];
}

const ConfirmLoadModal = (props: Props) => {
    const { isOpen, onClose, loadData, warehouses, products } = props;

    // Función para obtener el nombre del almacén a partir del UUID
    const getWarehouseName = (uuid: string) => {
        const warehouse = warehouses.find(w => w.uuid === uuid);
        return warehouse ? warehouse.name : uuid;
    };

    // Función para obtener el nombre del producto a partir del UUID
    const getProductName = (uuid: string) => {
        const product = products.find(p => p.uuid === uuid);
        return product ? product.name : uuid;
    };

    const handleConfirm = async () => {
        try {
            await loadWaggon(loadData);
            onClose();
        } catch (error) {
            console.error("Error confirming load:", error);
        }
    };

    useEffect(() => {
        console.log(loadData);
    }, [loadData]);

    return (
        <ModalContainer visible={isOpen} onClose={onClose} auto_width={false}>
            <div className="flex flex-col p-6 relative max-w-screen-sm self-center justify-self-center w-[80vw] md:w-[60vw] md:max-w-[620px]">
                <div className="absolute right-3 top-6">
                    <button className="font-bold font-sans p-3 -m-3" onClick={onClose}>
                        <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                    </button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">Confirmar Movimiento</span>
                </div>
                <div className="flex flex-col gap-4 xl:gap-6 py-6 px-4 w-full md:max-w-[400px] lg:max-w-[420px] self-center">
                    <div className="flex justify-between">
                        <span><strong>Origen:</strong> {getWarehouseName(loadData.origin)}</span>
                        <span><strong>Destino:</strong> {getWarehouseName(loadData.destination)}</span>
                    </div>
                    <div>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left">Producto</th>
                                    <th className="text-left">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadData.products && loadData.products.map((product: any, index: number) => (
                                    <tr key={index}>
                                        <td>{getProductName(product.name)}</td>
                                        <td>{product.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2"
                            onClick={onClose}>
                            <span>Seguir Editando</span>
                        </button>
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2" onClick={handleConfirm}>
                            <span>Confirmar</span>
                        </button>
                    </div>
                </div>
            </div>
        </ModalContainer>
    );
};

export default ConfirmLoadModal;
