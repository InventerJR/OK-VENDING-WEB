import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useCartContext, CartContextProvider, DataObject } from "./cart.context";
import CartDataTable from "./cart-table/data-table";
import { useForm } from "react-hook-form";
import ProductGrid from "../purchases-grid";
import { useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { useToast } from '@/components/toasts/use-toasts';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    origin: string;
    destination: string;
    cash: string;
}

type FormData = {
    // supplier: string; // Removed supplier field
}

function CartModalView(props: Props) {
    const { isOpen, onClose, origin, destination, cash } = props;
    const { closeCart, products, updateProduct, handleConfirmLoad } = useCartContext();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [productList, setProductList] = useState(products);
    const { loading, setLoading } = useAppContext();
    const { toastSuccess, toastError } = useToast();

    useEffect(() => {
        updateLocalStorage(productList);
    }, [productList]);

    const updateLocalStorage = (products: any[]) => {
        const formattedProducts = products.map(product => ({
            product_uuid: product.uuid,
            quantity: parseInt(product.quantity?.toString() || '0', 10),
        }));
        localStorage.setItem('productList', JSON.stringify(formattedProducts));
    };

    const handleProductChange = (index: number, field: keyof DataObject, value: any) => {
        updateProduct(index, field, value);
        setProductList([...products]);
    };

    const onSubmit = async () => { // Remove data parameter since we don't need to handle form data
        setLoading(true);
        const productos = JSON.parse(localStorage.getItem('productList') || '[]');

        const loadData = {
            origin,
            destination,
            cash: parseFloat(cash),
            products: productos.map((product: any) => ({
                product_uuid: product.product_uuid,
                quantity: product.quantity,
            })),
        };

        try {
            await handleConfirmLoad(loadData);
            toastSuccess({ message: "Carga realizada con éxito" });
            closeCart();
            onClose();
            localStorage.removeItem('productList');
            localStorage.removeItem('registeredProducts');
        } catch (error: any) {
            toastError({ message: error.message });
            console.error("Error registrando la carga:", error);
        } finally {
            setLoading(false);
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
                    <span className="font-bold text-xl">CARGA</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <br />
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
}

export default function CartModal(props: Props) {
    return (
        <CartContextProvider>
            <ProductGrid products={[]} />
            <CartModalView {...props} />
        </CartContextProvider>
    );
}