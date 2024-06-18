import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm } from "react-hook-form";
import ImagePicker from "@/components/image-picker";
import { useToast } from '@/components/toasts/use-toasts';
import { useEffect } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

type FormData = {
    nombre: string;
    marca: string;
    precioVenta: number;
    categoria: string;
    contenido: string;
    barCode: string;
    tipoProducto: string;
    proveedor: string;
    precioCompra: string;
}

const UpdateProductModal = (props: Props) => {
    const { isOpen, onClose, product } = props;
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
              toastSuccess({ message: "Se actualizo el producto" });
              
            }
      
           catch (error: any) {
            toastError({ message: error.message });
          }
      
    };

    useEffect(() => {
        console.log("Texto de información",props);
    },[props,]);

    return (
        <ModalContainer visible={isOpen} onClose={onClose} auto_width={false}>
            <div className="flex flex-col p-6 relative max-w-screen-sm self-center justify-self-center w-[80vw] md:w-[60vw] md:max-w-[620px]">
                <div className="absolute right-3 top-6">
                    <button className="font-bold font-sans p-3 -m-3" onClick={onClose}>
                        <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                    </button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">EDITAR</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-6 px-4">

                    <ImagePicker />

                    {/* text input  */}
                    <FormInput<FormData>
                        id={"input-id"}
                        name={"nombre"}
                        label={"Nombre"}
                        value={product?.name}
                        placeholder="Ingrese texto"
                        register={register}
                        rules={{
                            required: "El nombre es requerido"
                        }}
                    />

                    {/* text input  */}
                    <FormInput<FormData>
                        id={"input-id"}
                        name={"marca"}
                        label={"Marca"}
                        value={product?.brand}
                        placeholder="Ingrese la marca"
                        register={register}
                        rules={{
                            required: "La marca es requerida"
                        }}
                    />

                    {/* text input  */}
                    <FormInput<FormData>
                        id={"input-id"}
                        name={"precioVenta"}
                        label={"Precio de venta"}
                        value={product?.sale_price}
                        placeholder="Ingrese el precio"
                        register={register}
                        rules={{
                            required: "El precio es requerido",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />

                    {/* select */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="type" className="font-bold text-sm">Categoria</label>
                        <select
                            id="value1"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("categoria", { required: true })}
                            value={product?.category}
                        >
                            <option value=''>Seleccionar</option>
                            <option value="categoria">Categoria 1</option>
                            <option value="categoria">Categoria 2</option>
                            <option value="categoria">Categoria 3</option>
                            <option value="categoria">Categoria 4</option>

                        </select>
                    </div>

                    <FormInput<FormData>
                        id={"input-id"}
                        name={"contenido"}
                        label={"Contenido"}
                        value={product?.content}
                        placeholder="Ingrese el contenido"
                        register={register}
                        rules={{
                            required: "El contenido es requerido"
                        }}
                    />

                    <FormInput<FormData>
                        id={"input-id"}
                        name={"barCode"}
                        label={"Código de barras"}
                        value={product?.barCode}
                        placeholder="Ingrese el código"
                        register={register}
                        rules={{
                            required: true,
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />

                    {/* select */}
                    < div className="flex flex-col gap-2">
                        <label htmlFor="type" className="font-bold text-sm">Tipo de producto</label>
                        <select
                            id="value1"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("tipoProducto", { required: true })}
                            value={product?.typeProduct}
                        >
                            <option value=''>Seleccionar</option>
                            <option value="tipoProducto">Caja</option>
                            <option value="tipoProducto">Bolsa</option>
                            <option value="tipoProducto">Lata</option>
                            <option value="tipoProducto">Otro</option>

                        </select>
                    </div>

                    {/* select */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="type" className="font-bold text-sm">Provedoor</label>
                        <select
                            id="value1"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("proveedor", { required: true })}
                            value={product?.provider}
                        >
                            <option value=''>Seleccionar</option>
                            <option value="tipoProducto">Caja</option>
                            <option value="tipoProducto">Bolsa</option>
                            <option value="tipoProducto">Lata</option>
                            <option value="tipoProducto">Otro</option>

                        </select>
                    </div>


                    <FormInput<FormData>
                        id={"input-id"}
                        name={"precioCompra"}
                        label={"Precio de compra"}
                        value={product?.purchase_price}
                        placeholder="Ingrese el precio"
                        register={register}
                        rules={{
                            required: "El precio es requerido",
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
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2"
                            >
                            <span>Editar Producto</span>
                        </button>
                    </div>
                </form>

            </div>
        </ModalContainer>
    );
}

export default UpdateProductModal;