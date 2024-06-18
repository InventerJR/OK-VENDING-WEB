import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import { useToast } from "@/components/toasts/use-toasts";
import Image from "next/image";
import { useForm } from "react-hook-form";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    value1: string;
    value2: string;
}

export default function UpdateCategoryModal(props: Props) {
    const { isOpen, onClose } = props;
    const { toastSuccess, toastError } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        // setLoading(true);
        // login(data.company_alias, data.email, data.password);
        try {
            //const response = await loginUser(data); 
            //console.log("Respuesta del servidor:", response);

            // Verifica si el token está presente en la respuesta
            toastSuccess({ message: "Se editó la carga" });

        }

        catch (error: any) {
            toastError({ message: error.message });
        }
    };

    return (
        <ModalContainer visible={isOpen} onClose={onClose}>
            <div className="flex flex-col p-6 relative">
                <div className="absolute right-3 top-6">
                    <button className="font-bold font-sans p-3 -m-3" onClick={onClose}>
                        <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                    </button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">EDITAR CARGA</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-6 px-4">

                    {/* select */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="type" className="font-bold text-sm">Select</label>
                        <select
                            id="value1"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("value1", { required: true })}
                        >
                            <option value="admin">Almacen fisico</option>
                            <option value="user">Almacen Camioneta</option>
                        </select>
                    </div>

                    {/* select */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="type" className="font-bold text-sm">Select</label>
                        <select
                            id="value1"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("value1", { required: true })}
                        >
                            <option value="admin">Almacen fisico</option>
                            <option value="user">Almacen Camioneta</option>
                        </select>
                    </div>

                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3]  rounded-lg py-2"
                        onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Actualizar</span>
                        </button>
                    </div>
                </form>

            </div>
        </ModalContainer>
    );
}