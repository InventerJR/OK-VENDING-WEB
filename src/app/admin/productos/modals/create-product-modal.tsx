import { FormInput } from "@/components/forms/form-input";
import ImagePicker from "@/components/image-picker";
import ModalContainer from "@/components/layouts/modal-container";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';
import { registerProduct } from '../../../../../api';
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
    contenido: number;
    barCode: string;
    tipoProducto: string;
    packageQuantity: number;
    precioCompra: number;
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
        setValue,
        reset
    } = useForm<FormData>();

    const handleClose = () => {
        reset(); // Limpia los campos al cerrar el modal
        onClose();
    };

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
            reset();
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
                    <button className="font-bold font-sans p-3 -m-3" onClick={handleClose}>
                        <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                    </button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">CREAR PRODUCTO</span>
                </div>
                <div className="w-fit self-center  px-8">
                    <span className="text-sl text-[]">Los campos con un '*' son obligartorios</span>
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
                        label={"Nombre *"}
                        placeholder="Ingrese texto"
                        register={register}
                        rules={{
                            required: "El nombre es requerido"
                        }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.nombre && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.nombre.message}
                        </p>
                    )}

                    {/* select marcas */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="marca" className="font-bold text-sm">Marca *</label>
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
                        label={"Precio de venta *"}
                        placeholder="Ingrese el precio"
                        register={register}
                        type={"number"}
                        step={"0.01"}
                        rules={{
                            required: "El precio es requerido",
                            pattern: {
                                value: /^[0-9]*\.?[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.precioVenta && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.precioVenta.message}
                        </p>
                    )}

                    {/* select categorías */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="categoria" className="font-bold text-sm">Categoría *</label>
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
                        label={"Contenido (g / ml) *"}
                        type={"number"}
                        step={"0.01"}
                        placeholder="Ingrese el contenido (g / ml)"
                        register={register}
                        rules={{
                            required: "El contenido es requerido"
                        }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.contenido && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.contenido.message = "Contenido es obligatorio (g / ml)"}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"barCode"}
                        name={"barCode"}
                        label={"Código de barras *"}
                        placeholder="Ingrese el código"
                        register={register}
                        rules={{
                            required: "El código de barras es requerido",
                        }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.barCode && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.barCode.message}
                        </p>
                    )}

                    {/* select tipo de producto */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tipoProducto" className="font-bold text-sm">Tipo de producto *</label>
                        <select
                            id="tipoProducto"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("tipoProducto", { required: true })}
                        >
                            <option value=''>Seleccionar</option>
                            <option value="1">Caja</option>
                            <option value="2">Bolsa</option>
                            <option value="3">Lata</option>
                            <option value="0">Otro</option>
                        </select>
                    </div>

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.tipoProducto && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.tipoProducto.message}
                        </p>
                    )}

                    {/* text input packageQuantity */}
                    <FormInput<FormData>
                        id={"packageQuantity"}
                        name={"packageQuantity"}
                        label={"Cantidad del paquete *"}
                        type={"number"}
                        step={"0.01"}
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

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.packageQuantity && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.packageQuantity.message}
                        </p>
                    )}

                    <FormInput<FormData>
                        id={"precioCompra"}
                        name={"precioCompra"}
                        label={"Precio de compra *"}
                        type={"number"}
                        step={"0.01"}
                        placeholder="Ingrese el precio"
                        register={register}
                        rules={{
                            required: "El precio es requerido",
                            pattern: {
                                value: /^[0-9]*\.?[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                    />

                    {/* Mostrar mensaje de error si el campo está vacío */}
                    {errors.precioCompra && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.precioCompra.message}
                        </p>
                    )}

                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2"
                            onClick={handleClose}>
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