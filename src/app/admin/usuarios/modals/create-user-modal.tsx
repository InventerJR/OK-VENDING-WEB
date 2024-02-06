import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm } from "react-hook-form";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    type: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}

export default function CreateUserModal(props: Props) {
    const { isOpen, onClose } = props;

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


    return (
        <ModalContainer visible={isOpen} onClose={onClose} auto_width={true}>
            <div className="flex flex-col p-6 self-center justify-self-center">
                <div className="absolute right-3 top-6">
                    <button className="font-bold font-sans p-3 -m-3" onClick={onClose}>
                        <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                    </button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">CREAR USUARIO</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 md:gap-4 py-6 px-4 self-center">

                    {/* select */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="type" className="font-bold text-sm">Tipo de usuario</label>
                        <select
                            id="type"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("type", { required: true })}
                        >
                            <option value="admin">Administrador</option>
                            <option value="user">Usuario</option>
                        </select>
                    </div>

                    <FormInput<FormData>
                        id={"name"}
                        name={"name"}
                        label={"Nombre"}
                        placeholder="Ingrese el nombre"
                        register={register}
                    />
                    <FormInput<FormData>
                        id={"address"}
                        name={"address"}
                        label={"Dirección"}
                        placeholder="Ingrese la dirección"
                        register={register}
                    />
                    <FormInput<FormData>
                        id={"phone"}
                        name={"phone"}
                        label={"Teléfono"}
                        placeholder="Ingrese el teléfono"
                        register={register}
                    />
                    <FormInput<FormData>
                        id={"email"}
                        autoComplete="new-password"
                        name={"email"}
                        label={"Correo electrónico"}
                        placeholder="Ingrese el correo electrónico"
                        register={register}
                    />
                    <FormInput<FormData>
                        id={"password"}
                        type="password"
                        autoComplete="new-password"
                        name={"password"}
                        label={"Contraseña"}
                        placeholder="Ingrese la contraseña"
                        register={register}
                    />

                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3]  rounded-lg py-2"
                            onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Crear usuario</span>
                        </button>
                    </div>
                </form>

                {/* <div className="h-[500px]">

                </div> */}
            </div>
        </ModalContainer>
    );
}