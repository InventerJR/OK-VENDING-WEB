import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';
import { registerCompanyMovement } from '../../../../../api';
import { useAppContext } from '@/hooks/useAppContext';
import { usePageContext } from "../page.context";
import Image from "next/image";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    movement_type: string;
    incoming: string;
    outgoing: string;
}

const CreateMovementModal = (props: Props) => {
    const { loading, setLoading } = useAppContext();
    const { isOpen, onClose } = props;
    const { toastSuccess, toastError } = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const { refreshData } = usePageContext(); // Añadir el método refreshData del contexto

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            const formattedData = {
                movement_type: data.movement_type,
                incoming: data.incoming || "0.00",
                outgoing: data.outgoing || "0.00",
            };

            await registerCompanyMovement(formattedData);
            toastSuccess({ message: "Movimiento registrado con éxito" });
            refreshData(); // Refresca los datos después de registrar el movimiento
            onClose();
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.Error) {
                toastError({ message: error.response.data.Error });
            } else {
                toastError({ message: "Error al crear el movimineto" });
            }
        } finally {
            setLoading(false);
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
                    <span className="font-bold text-xl">REGISTRAR MOVIMIENTO</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit, () => {
                    Object.values(errors).forEach(error => {
                        toastError({ message: error.message || "Error en el campo" });
                    });
                })} className="flex flex-col gap-2 md:gap-4 py-6 px-4 self-center">
                    <div className="flex flex-col gap-4">
                        <label htmlFor="movement_type" className="font-medium text-sm">Tipo de Movimiento</label>
                        <select
                            id="movement_type"
                            {...register("movement_type", { required: "El tipo de movimiento es requerido" })}
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                        >
                            <option value="cash_in">cash_in</option>
                            <option value="cash_out">cash_out</option>
                        </select>
                        {errors.movement_type && <span className="text-red-500 text-xs">{errors.movement_type.message}</span>}
                    </div>
                    <FormInput<FormData>
                        id={"incoming"}
                        name={"incoming"}
                        label={"Monto de Entrada"}
                        placeholder="Ingrese el monto de entrada"
                        register={register}
                        rules={{
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />
                    <FormInput<FormData>
                        id={"outgoing"}
                        name={"outgoing"}
                        label={"Monto de Salida"}
                        placeholder="Ingrese el monto de salida"
                        register={register}
                        rules={{
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />
                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2" onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Registrar</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
};

export default CreateMovementModal;
