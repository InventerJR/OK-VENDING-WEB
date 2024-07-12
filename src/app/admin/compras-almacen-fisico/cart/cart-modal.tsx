import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useCartContext, CartContextProvider } from "./cart.context";
import CartDataTable from "./cart-table/data-table";
import { useForm } from "react-hook-form";
import ProductGrid from "../purchases-grid";
import { useEffect, useState } from "react";
import { registerPurchase } from "../../../../../api";
import { useAppContext } from "@/hooks/useAppContext";
import { useToast } from '@/components/toasts/use-toasts';
import { localStorageWrapper } from '@/utils/localStorageWrapper';


type Props = {
    isOpen: boolean;
    onClose: () => void;
    openCart?: () => void;
}

type FormData = {
    supplier: string;
    ticket_image: FileList;
}

function CartModalView(props: Props) {
    const { isOpen, onClose } = props;
    const { openTicketCart, closeCart, suppliers, fetchSuppliers, products, updateProduct } = useCartContext();
    const { setValue, register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [productList, setProductList] = useState(products);
    const { loading, setLoading } = useAppContext();
    const { toastSuccess, toastError } = useToast();

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    useEffect(() => {
        updatelocalStorageWrapper(productList);
    }, [productList]);

    const updatelocalStorageWrapper = (products: any[]) => {
        const formattedProducts = products.map(product => ({
            product_uuid: product.uuid,
            buying_price: parseFloat(product.purchase_price?.toString() || '0'),
            quantity: parseInt(product.quantity?.toString() || '0', 10),
            expiration: product.expiration,
            package_quantity: parseInt(product.package_quantity?.toString() || '1', 10) || 1,
        }));
        localStorageWrapper.setItem('productList', JSON.stringify(formattedProducts));
    };

    const handleProductChange = (index: number, field: string, value: any) => {
        //@ts-ignore
        updateProduct(index, field, value);
        setProductList([...products]);
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        const ticketImage = data.ticket_image;
        const supplierUuid = localStorageWrapper.getItem('selectedSupplier');
        const warehousePlaceUuid = localStorageWrapper.getItem('selectedWarehousePlaceUUID');
        const productos = JSON.parse(localStorageWrapper.getItem('productList') || '[]');

        const totalAmount = productos.reduce((total: number, prod: { buying_price: number; quantity: number; package_quantity: number; }) =>
            total + (prod.buying_price * prod.quantity * prod.package_quantity), 0);

        const formData = new FormData();
        formData.append('supplier_uuid', supplierUuid || '');
        formData.append('total_amount', totalAmount.toString());
        formData.append('productos', JSON.stringify(productos));
        formData.append('warehouse_place_uuid', warehousePlaceUuid || '');
        formData.append('ticket_image', ticketImage[0]);

        try {
            await registerPurchase(formData);
            toastSuccess({ message: "Se registro la compra" });
            closeCart();
            onClose();
            localStorageWrapper.removeItem('productList');
            localStorageWrapper.removeItem('registeredProducts');
            openTicketCart(); // Abre el modal de tickets
            //window.location.reload(); // Usar window.location.reload() en lugar de router.reload()
        } catch (error: any) {
            toastError({ message: error.message });
            console.error("Error registering purchase:", error);
        }finally{
            setLoading(false);
        }
    };

    const handleSupplierChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSupplier = suppliers.find(supplier => supplier.id === parseInt(event.target.value, 10));
        if (selectedSupplier) {
            localStorageWrapper.setItem('selectedSupplier', selectedSupplier.uuid);
        }
    };

    return (
        <ModalContainer visible={isOpen} onClose={onClose} auto_width={false}>
            <div className="flex flex-col gap-2 p-6 relative self-center justify-self-center w-[80vw] sm:w-[70vw] md:w-[80vw]">
                <div className="absolute right-3 top-6">
                    <button className="font-bold font-sans p-3 -m-3" onClick={onClose}>
                        <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                    </button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">VENTAS</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <br />
                    <div className="flex justify-between items-start w-full p-4">
                        <div className='flex flex-col items-start'>
                            <label className='flex flex-col min-w-[140px] md:w-[240px]'>
                                <span className='font-semibold'>Selecciona un proveedor</span>
                                <select
                                    className='border border-gray-300 rounded-md h-[30px]'
                                    {...register("supplier", { required: true })}
                                    onChange={handleSupplierChange}
                                >
                                    <option value=''>Seleccionar</option>
                                    {suppliers && suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                    ))}
                                </select>
                                {errors.supplier && <span className="text-red-500">Este campo es requerido</span>}
                            </label>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <label className="font-semibold text-lg">Ticket Image</label>
                            <input
                                type="file"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                {...register("ticket_image", { required: true })}
                            />
                            {errors.ticket_image && (
                                <span className="text-red-500 text-sm mt-1">Este campo es requerido</span>
                            )}
                        </div>
                    </div>
                    <div className="min-h-[200px] max-w-full overflow-auto">
                        <CartDataTable onProductChange={handleProductChange} />
                    </div>
                    <div className="flex flex-col gap-2 w-full items-center py-12">
                        <button type="submit" className="bg-[#58B7A3] text-white rounded-lg py-2 px-4 w-full">
                            Guardar
                        </button>
                        <button className="border border-[#58B7A3] text-[#58B7A3] rounded-lg py-2 px-4 w-full" onClick={onClose}>
                            Cerrar
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
};

export default function CartModal(props: Props) {
    return (
        <CartContextProvider>
            <ProductGrid searchTerm={""} selectedCategory={""} selectedSupplier={""} />
            <CartModalView {...props} />
        </CartContextProvider>
    );
}
