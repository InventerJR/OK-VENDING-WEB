import { FormInput } from "@/components/forms/form-input";
import ImagePicker from "@/components/image-picker";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    plate: string;
    last_service_date: string;
    tank: number;
    consumption: string;
    kilometers: string;
    cash: string;
    insurance_expiration_date: string;
}

const CreateWagonWarehouse = (props: Props) => {
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
            toastSuccess({ message: "Se creó la camioneta" });

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
                    <span className="font-bold text-xl">CREAR CAMIONETA</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 xl:gap-6 py-6 px-4 w-full md:max-w-[400px] lg:w-[420px]  self-center">

                    {/* text input  */}
                    <FormInput<FormData>
                        id={"input-id"}
                        name={"plate"}
                        label={"Placa"}
                        placeholder="Ingrese la placa"
                        register={register}
                        rules={{
                            required: "La placa es requerida"
                        }}
                    />

                    {/* text input  */}
                    <FormInput<FormData>
                        id={"input-id"}
                        name={"last_service_date"}
                        label={"Marca"}
                        placeholder="Ingrese la fecha"
                        register={register}
                        rules={{
                            required: "La fecha es requerida"
                        }}
                    />

                    {/* text input  */}
                    <FormInput<FormData>
                        id={"input-id"}
                        name={"tank"}
                        label={"Tanque de la camioneta"}
                        placeholder="Ingrese los litros"
                        register={register}
                        rules={{
                            required: "Los litros son requeridos",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />

                    <FormInput<FormData>
                        id={"input-id"}
                        name={"consumption"}
                        label={"Consumo"}
                        placeholder="Ingrese el consumo"
                        register={register}
                        rules={{
                            required: "El contenido es requerido"
                        }}
                    />

                    <FormInput<FormData>
                        id={"input-id"}
                        name={"kilometers"}
                        label={"Kilometraje"}
                        placeholder="Ingrese el contenido"
                        register={register}
                        rules={{
                            required: "Los litros son requeridos",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />

                    <FormInput<FormData>
                        id={"input-id"}
                        name={"cash"}
                        label={"Dinero"}
                        placeholder="Ingrese la cantidad de dinero"
                        register={register}
                        rules={{
                            required: "El dinero es requerido",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />

                    <FormInput<FormData>
                        id={"input-id"}
                        name={"insurance_expiration_date"}
                        label={"Vencimiento del seguro"}
                        placeholder="Ingrese la fecha"
                        register={register}
                        rules={{
                            required: "La fecha es requerida",
                        }}
                    />


                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3]  rounded-lg py-2"
                            onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2"
                            onClick={onClose}>
                            <span>Crear Camioneta</span>
                        </button>
                    </div>
                </form>

                {/* <div className="h-[500px]">

                </div> */}
            </div>
        </ModalContainer>
    );
};
export default CreateWagonWarehouse;