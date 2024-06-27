import { FormInput } from "@/components/forms/form-input";
import ImagePicker from "@/components/image-picker";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';
import { registerProduct } from '../../../../../api_categories_products'; // Importa la función de registro
import { usePageContext } from "../page.context"; // Importa el contexto

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

type FormData = {
    nombre: string;
    marca: string;
    precioVenta: number; 
    categoria: string;
    contenido: string;
    barCode: string;
    tipoProducto: string;
    packageQuantity: number;
    precioCompra: string;
    image: FileList;
}

const CreateProductModal = (props: Props) =>{
    const { isOpen, onClose } = props;
    const { toastSuccess, toastError } = useToast();
    const { brands, categories } = usePageContext(); // Usa el contexto para obtener las categorías y marcas

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            const productData = {
                name: data.nombre,
                brand_uuid: data.marca,
                sale_price: data.precioVenta,
                category_uuid: data.categoria,
                grammage: data.contenido,
                id_code: data.barCode,
                model: data.tipoProducto,
                package_quantity: data.packageQuantity,
                image: data.image[0]
            };

            await registerProduct(productData);
            toastSuccess({ message: "Se creó el producto" });
            onClose(); // Cerrar el modal al crear el producto
        } catch (error: any) {
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
                    <span className="font-bold text-xl">CREAR PRODUCTO</span>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 xl:gap-6 py-6 px-4 w-full md:max-w-[400px] lg:w-[420px] self-center">

                    <ImagePicker register={register} setValue={setValue} />

                    {/* text input */}
                    <FormInput<FormData>
                        id={"input-id"}
                        name={"nombre"}
                        label={"Nombre"}
                        placeholder="Ingrese texto"
                        register={register}
                        rules={{
                            required: "El nombre es requerido"
                        }}
                    />

                    {/* select */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="marca" className="font-bold text-sm">Marca</label>
                        <select
                            id="marca"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("marca", { required: "La marca es requerida" })}
                        >
                            <option value=''>Seleccionar</option>
                            {brands.map((brand) => (
                                <option key={brand.uuid} value={brand.uuid}>{brand.name}</option>
                            ))}
                        </select>
                        {errors.marca && <span className="text-red-500 text-sm">{errors.marca.message}</span>}
                    </div>

                    {/* text input */}
                    <FormInput<FormData>
                        id={"input-id"}
                        name={"precioVenta"}
                        label={"Precio de venta"}
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
                        <label htmlFor="categoria" className="font-bold text-sm">Categoría</label>
                        <select
                            id="categoria"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("categoria", { required: "La categoría es requerida" })}
                        >
                            <option value=''>Seleccionar</option>
                            {categories.map((category) => (
                                <option key={category.uuid} value={category.uuid}>{category.name}</option>
                            ))}
                        </select>
                        {errors.categoria && <span className="text-red-500 text-sm">{errors.categoria.message}</span>}
                    </div>

                    <FormInput<FormData>
                        id={"input-id"}
                        name={"contenido"}
                        label={"Contenido"}
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
                        placeholder="Ingrese el código"
                        register={register}
                        rules={{
                            required: true,
                        }}
                    />

                    {/* select */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tipoProducto" className="font-bold text-sm">Tipo de producto</label>
                        <select
                            id="tipoProducto"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("tipoProducto", { required: true })}
                        >
                            <option value=''>Seleccionar</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="Otro">0</option>
                        </select>
                    </div>

                    {/* select */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="proveedor" className="font-bold text-sm">Proveedor</label>
                        <select
                            id="proveedor"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("packageQuantity", { required: true })}
                        >
                            <option value=''>Seleccionar</option>
                            <option value="1">Proveedor 1</option>
                            <option value="5">Proveedor 2</option>
                            <option value="0">Proveedor 3</option>
                        </select>
                    </div>

                    <FormInput<FormData>
                        id={"input-id"}
                        name={"precioCompra"}
                        label={"Precio de compra"}
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
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2"
                            onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Crear Producto</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
};

export default CreateProductModal;
