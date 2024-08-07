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

const CreateProductModal = (props: Props) => {
    const { isOpen, onClose } = props;
    const { toastSuccess, toastError } = useToast();
    const { brands, categories, refreshProductos } = usePageContext(); // Usa el contexto para obtener las categorías y marcas

    const {
        register,
        handleSubmit,
        formState: { errors },
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
                purchase_price: data.precioCompra,
                image: data.image
            };

            await registerProduct(productData);
            toastSuccess({ message: "Se creó el producto" });
            refreshProductos();
            onClose(); // Cerrar el modal al crear el producto
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.Error) {
                toastError({ message: error.response.data.Error });
            } else {
                toastError({ message: "Error al crear el producto" });
            }
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
                <form onSubmit={handleSubmit(onSubmit, () => {
                    Object.values(errors).forEach(error => {
                        toastError({ message: error.message || "Error en el campo" });
                    });
                })} className="flex flex-col gap-2 md:gap-4 py-6 px-4 self-center">
                    <ImagePicker register={register} setValue={setValue} />

                    {/* text input */}
                    <FormInput<FormData>
                        id={"nombre"}
                        name={"nombre"}
                        label={"Nombre"}
                        placeholder="Ingrese texto"
                        register={register}
                        rules={{
                            required: "El nombre es requerido"
                        }}
                    />

                    {/* select marcas */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="marca" className="font-bold text-sm">Marca</label>
                        <select
                            id="marca"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("marca", { required: "La marca es requerida" })}
                        >
                            <option value=''>Seleccionar</option>
                            {brands.map((brand) => (
                                <option key={brand.name} value={brand.uuid}>{brand.name}</option>
                            ))}
                        </select>
                        {errors.marca && <span className="text-red-500 text-sm">{errors.marca.message}</span>}
                    </div>

                    {/* text input */}
                    <FormInput<FormData>
                        id={"precioVenta"}
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

                    {/* select categorías */}
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
                        id={"contenido"}
                        name={"contenido"}
                        label={"Contenido"}
                        placeholder="Ingrese el contenido"
                        register={register}
                        rules={{
                            required: "El contenido es requerido"
                        }}
                    />

                    <FormInput<FormData>
                        id={"barCode"}
                        name={"barCode"}
                        label={"Código de barras"}
                        placeholder="Ingrese el código"
                        register={register}
                        rules={{
                            required: true,
                        }}
                    />

                    {/* select tipo de producto */}
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
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    {/* text input packageQuantity */}
                    <FormInput<FormData>
                        id={"packageQuantity"}
                        name={"packageQuantity"}
                        label={"Cantidad del paquete"}
                        placeholder="Ingrese la cantidad"
                        register={register}
                        rules={{
                            required: "La cantidad es requerida",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />

                    <FormInput<FormData>
                        id={"precioCompra"}
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