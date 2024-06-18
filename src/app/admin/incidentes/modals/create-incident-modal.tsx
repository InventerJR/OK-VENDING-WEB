import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    tipo: string;
    fecha: string;
    montoSalida: number;
    montoEntrada: number;
}

const CreateIncidentModal = (props: Props) => {
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
            toastSuccess({ message: "Se creó el incidente" });

        }

        catch (error: any) {
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
                    <span className="font-bold text-xl">CREAR INCIDENTE</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 xl:gap-6 py-6 px-4 w-full md:max-w-[400px] lg:w-[420px]  self-center">

                    {/* select */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="type" className="font-bold text-sm">Tipo de Siniestro</label>
                        <select
                            id="value1"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("tipo", { required: true })}
                        >
                            <option value="registroNomina">Registro nómina</option>
                            <option value="registroCombustible">Registro de combustible</option>
                            <option value="gastosVariables">Gastos variables</option>
                            <option value="detalleIncidente">Detalle del incidente</option>
                            <option value="otroSiniestro">Otro tipo de siniestro</option>
                        </select>
                    </div>

                    {/* text input  */}
                    <FormInput<FormData>
                        id={"date-id"}
                        name={"fecha"}
                        label={"Fecha"}
                        placeholder="Ingresa la frecha"
                        register={register}
                        rules={{
                            required: "La fecha es requerida",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />

                    <FormInput<FormData>
                        id={"monto-id"}
                        name={"montoEntrada"}
                        label={"Monto de entrada"}
                        placeholder="Ingrese el monto"
                        register={register}
                        rules={{
                            required: "El monto es requerido",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />

                    <FormInput<FormData>
                        id={"monto-id"}
                        name={"montoSalida"}
                        label={"Monto de salida"}
                        placeholder="Ingrese el monto"
                        register={register}
                        rules={{
                            required: "El monto es requerido",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />


                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3]  rounded-lg py-2"
                            onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Crear Incidente</span>
                        </button>
                    </div>
                </form>

                {/* <div className="h-[500px]">

                </div> */}
            </div>
        </ModalContainer>
    );
};
export default CreateIncidentModal;