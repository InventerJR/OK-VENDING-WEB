import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { CartContextProvider, useCartContext } from "./cart.context";
import CartDataTableTicket from "./cart-table/data-table-ticket";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    value1: string;
    value2: string;
}

function CartModalTicketView(props: Props) {
    const { isOpen, onClose } = props;
    const { closeCart } = useCartContext();



    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        // setLoading(true);
        // login(data.company_alias, data.email, data.password);
    };

    const onSave = () => {
        closeCart();
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
                    <span className="font-bold text-xl">TICKET</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row gap-4 xl:gap-6 py-6 px-4 w-full self-center">

                    {/* <span>Seleccione el almacén donde se registra la venta</span> */}

                    {/* select */}
                    <div className="flex flex-col gap-2">
                        {/* <label htmlFor="type" className="font-bold text-sm">Select</label> */}

                    </div>


                </form>

                <div className="min-h-[200px] max-w-full overflow-auto">
                    <CartDataTableTicket />
                </div>

                <div className="flex flex-row gap-4 ml-[40%]">
                    <button className="text-[#58B7A3] border border-[#58B7A3] rounded-lg py-2 px-4 w-full" onClick={onClose}>Cerrar</button>
                    <button className="bg-[#58B7A3] text-white rounded-lg py-2 px-4 w-full" onClick={onSave}>OK</button>
                </div>
            </div>
        </ModalContainer>
    );
}

export default function CartModal(props: Props) {
    return (
        <CartContextProvider>
            <CartModalTicketView {...props} />
        </CartContextProvider>
    );
}