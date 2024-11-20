// confirm-purchase-modal.tsx

import React, { useState, useEffect } from 'react';
import ModalContainer from "@/components/layouts/modal-container";
import { StockDataObject } from "../page.context";
import { useAppContext } from "@/hooks/useAppContext";
import { useToast } from "@/components/toasts/use-toasts";
import { registerPurchase } from '../../../../../api';
import { localStorageWrapper } from '@/utils/localStorageWrapper';

type ConfirmPurchaseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedProducts: { [key: string]: Partial<StockDataObject> };
    formData: FormData;
};

type FormData = {
    supplier: string;
    ticket_image: FileList;
};

const ConfirmPurchaseModal: React.FC<ConfirmPurchaseModalProps> = ({
    isOpen,
    onClose,
    selectedProducts,
    formData,
}) => {
    const [editableProducts, setEditableProducts] = useState<{ [key: string]: Partial<StockDataObject> }>(selectedProducts);
    const { setLoading } = useAppContext();
    const { toastSuccess, toastError } = useToast();
    const [errors, setErrors] = useState<{ [key: string]: { [field in keyof StockDataObject]?: string } }>({});


    useEffect(() => {
        if (isOpen) {
            setEditableProducts(selectedProducts);
        }
    }, [isOpen, selectedProducts]);

    const handleProductChange = (uuid: string, field: keyof StockDataObject, value: any) => {
        setEditableProducts((prev) => ({
            ...prev,
            [uuid]: { ...prev[uuid], [field]: value },
        }));
    };

    const handleSave = async () => {
        await onSubmit();
    };

    const onSubmit = async () => {
        setLoading(true);

        const ticketImage = formData.ticket_image;
        const supplierUuid = localStorageWrapper.getItem('selectedSupplier');
        const warehousePlaceUuid = localStorageWrapper.getItem('selectedWarehousePlaceUUID');
        const productos = Object.values(editableProducts);

        const validProducts = productos.filter((prod) => {
            const quantity = parseInt(prod.quantity as unknown as string, 10);
            const package_quantity = parseInt(prod.package_quantity as unknown as string, 10);
            const purchase_price = parseFloat(prod.purchase_price as unknown as string);

            return (
                prod.uuid &&
                quantity > 0 &&
                package_quantity > 0 &&
                prod.expiration &&
                !isNaN(purchase_price) &&
                purchase_price > 0
            );
        });

        if (validProducts.length === 0) {
            toastError({ message: "Debes seleccionar al menos un producto con información válida. Verifica todos los campos del producto." });
            setLoading(false);
            return;
        }

        const simplifiedProducts = validProducts.map((prod) => ({
            product_uuid: prod.uuid,
            quantity: parseInt(prod.quantity as unknown as string, 10),
            purchase_price: parseFloat(prod.purchase_price as unknown as string),
            expiration: prod.expiration,
            package_quantity: parseInt(prod.package_quantity as unknown as string, 10),
        }));

        const totalAmount = simplifiedProducts.reduce((total, prod) =>
            total + (prod.purchase_price * prod.quantity * prod.package_quantity), 0);

        const apiFormData = new FormData();
        apiFormData.append('supplier_uuid', supplierUuid || '');
        apiFormData.append('total_amount', totalAmount.toFixed(2));
        apiFormData.append('productos', JSON.stringify(simplifiedProducts));
        apiFormData.append('warehouse_place_uuid', warehousePlaceUuid || '');
        apiFormData.append('ticket_image', ticketImage[0]);

        try {
            const response = await registerPurchase(apiFormData);

            if (response.status === 404) {
                throw new Error("Producto no encontrado o endpoint incorrecto. Verifica los datos enviados.");
            }

            console.log('Compra registrada exitosamente:', response);
            toastSuccess({ message: "Se registró la compra con éxito" });

            localStorageWrapper.removeItem('selectedProducts');
            onClose();
        } catch (error: any) {
            console.error("Error al registrar la compra:", error);
            toastError({ message: error.message || "Error desconocido al registrar la compra." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalContainer visible={isOpen} onClose={onClose}>
            <div className="p-6 w-full max-w-3xl mx-auto bg-white rounded-md">
                <div className="w-fit self-center border-b-[4px] border-b-[#2C3375] px-16">
                    <span className="font-bold text-xl">CONFIRMAR COMPRA</span>
                </div>
                <br />
                <div className="w-fit self-center  px-8">
                    <span className="text-xl text-[] font-bold">Lista de productos a comprar</span>
                    <br />
                    <span className="text-xl text-[] ">(Verifica que todo este correcto)</span>
                </div>
                <br />
                <div className="flex flex-col gap-4">
                    {Object.entries(editableProducts).map(([uuid, product]) => (
                        <div key={uuid} className="border p-3 rounded-lg flex gap-4 items-center">
                            <img
                                src={product.image || "/default-product.png"}
                                alt={product.name || "Producto"}
                                className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{product.name || "Producto"}</h3>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <label>
                                        Cantidad:
                                        <input
                                            type="number"
                                            value={product.quantity || ""}
                                            onChange={(e) =>
                                                handleProductChange(uuid, "quantity", e.target.value)
                                            }
                                            className={`w-full border rounded-md p-1 ${errors[uuid]?.quantity ? "border-red-500" : ""}`}
                                        />
                                        {errors[uuid]?.quantity && <p className="text-red-500 text-sm">{errors[uuid].quantity}</p>}
                                    </label>
                                    <label>
                                        Precio de compra:
                                        <input
                                            type="number"
                                            value={product.purchase_price || ""}
                                            onChange={(e) =>
                                                handleProductChange(uuid, "purchase_price", e.target.value)
                                            }
                                            className={`w-full border rounded-md p-1 ${errors[uuid]?.purchase_price ? "border-red-500" : ""}`}
                                        />
                                        {errors[uuid]?.purchase_price && <p className="text-red-500 text-sm">{errors[uuid].quantity}</p>}
                                    </label>
                                    <label>
                                        Cantidad por paquete:
                                        <input
                                            type="number"
                                            value={product.package_quantity || ""}
                                            onChange={(e) =>
                                                handleProductChange(uuid, "package_quantity", e.target.value)
                                            }
                                            className={`w-full border rounded-md p-1 ${errors[uuid]?.package_quantity ? "border-red-500" : ""}`}
                                        />
                                        {errors[uuid]?.package_quantity && <p className="text-red-500 text-sm">{errors[uuid].quantity}</p>}
                                    </label>
                                    <label>
                                        Fecha de caducidad:
                                        <input
                                            type="date"
                                            value={product.expiration || ""}
                                            onChange={(e) =>
                                                handleProductChange(uuid, "expiration", e.target.value)
                                            }
                                            className={`w-full border rounded-md p-1 ${errors[uuid]?.expiration ? "border-red-500" : ""}`}
                                        />
                                        {errors[uuid]?.expiration && <p className="text-red-500 text-sm">{errors[uuid].quantity}</p>}
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="bg-[#58B7A3] text-white rounded-lg py-2 px-10">
                        Confirmar
                    </button>
                </div>
            </div>
        </ModalContainer>
    );
};

export default ConfirmPurchaseModal;
