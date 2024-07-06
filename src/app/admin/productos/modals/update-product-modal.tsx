import { FormInput } from "@/components/forms/form-input";
import ModalContainer from "@/components/layouts/modal-container";
import ImagePicker from "@/components/image-picker";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useToast } from '@/components/toasts/use-toasts';
import { useEffect, useState } from "react";
import { updateProduct } from "../../../../../api_categories_products"; // Importa la función de actualización
import { usePageContext } from "../page.context"; // Importa el contexto

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
    contenido: number;
    barCode: string;
    tipoProducto: string;
    packageQuantity: number;
    precioCompra: number;
    image: File | null;
}

const UpdateProductModal = (props: Props) => {
    const { isOpen, onClose, product } = props;
    const { toastSuccess, toastError } = useToast();
    const { brands, categories, updateProductData,refreshProductos } = usePageContext(); // Usa el contexto para obtener las categorías y marcas
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [initialImage, setInitialImage] = useState<string | null>(product?.image || null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    useEffect(() => {
        if (product) {
            setValue("nombre", product.name);
            setValue("marca", product.brand_uuid);
            setValue("precioVenta", product.sale_price);
            setValue("categoria", product.category_uuid);
            setValue("contenido", product.grammage);
            setValue("barCode", product.id_code);
            setValue("tipoProducto", product.model);
            setValue("packageQuantity", product.package_quantity);
            setValue("precioCompra", product.purchase_price);
            setSelectedImage(null); // Reset image
            setInitialImage(product.image || null); // Set initial image
        }
    }, [product, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            const productData = {
                uuid: product.uuid,
                name: data.nombre,
                brand_uuid: data.marca,
                sale_price: data.precioVenta,
                category_uuid: data.categoria,
                grammage: data.contenido,
                id_code: data.barCode,
                model: data.tipoProducto,
                package_quantity: data.packageQuantity,
                purchase_price: data.precioCompra,
                image: selectedImage
            };

            const updatedProduct = await updateProduct(productData);
            updateProductData(updatedProduct); // Actualiza el producto en el estado global
            refreshProductos();
            toastSuccess({ message: "Se actualizó el producto" });
            onClose(); // Cerrar el modal al actualizar el producto
        } catch (error: any) {
            toastError({ message: error.message });
        }
    };

    if (!product) return null; // Asegúrate de que el producto esté definido antes de renderizar el formulario

    return (
        <ModalContainer visible={isOpen} onClose={onClose} auto_width={false}>
            <div className="flex flex-col p-6 relative max-w-screen-sm self-center justify-self-center w-[80vw] md:w-[60vw] md:max-w-[620px]">
                <div className="absolute right-3 top-6">
                    <button className="font-bold font-sans p-3 -m-3" onClick={onClose}>
                        <Image src="/img/actions/close.svg" alt="close" width={26} height={26} />
                    </button>
                </div>
                <div className="w-fit self-center border-b-[3px] border-b-[#2C3375] px-8">
                    <span className="font-bold text-xl">EDITAR PRODUCTO</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 py-6 px-4">
                    <ImagePicker register={register} setValue={setValue} initialImage={initialImage} onImageSelect={setSelectedImage} />

                    <FormInput<FormData>
                        id={"nombre"}
                        name={"nombre"}
                        label={"Nombre"}
                        placeholder="Ingrese el nombre"
                        register={register}
                        rules={{
                            required: "El nombre es requerido"
                        }}
                    />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="marca" className="font-bold text-sm">Marca</label>
                        <select
                            id="marca"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("marca", { required: "La marca es requerida" })}
                            defaultValue={product?.brand_uuid}
                        >
                            <option value=''>Seleccionar</option>
                            {brands.map((brand) => (
                                <option key={brand.uuid} value={brand.uuid}>{brand.name}</option>
                            ))}
                        </select>
                        {errors.marca && <span className="text-red-500 text-sm">{errors.marca.message}</span>}
                    </div>

                    <FormInput<FormData>
                        id={"precioVenta"}
                        name={"precioVenta"}
                        label={"Precio de venta"}
                        placeholder="Ingrese el precio"
                        register={register}
                        rules={{
                            required: "El precio es requerido",
                            pattern: {
                                value: /^[0-9]+(\.[0-9]{1,2})?$/, // Permite números y decimales
                                message: "Formato de precio inválido"
                            }
                        }}
                        defaultValue={product?.sale_price}
                    />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="categoria" className="font-bold text-sm">Categoría</label>
                        <select
                            id="categoria"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("categoria", { required: "La categoría es requerida" })}
                            defaultValue={product?.category_uuid}
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
                            required: "El contenido es requerido",
                            pattern: {
                                value: /^[0-9]*$/,
                                message: "Solo se permiten números"
                            }
                        }}
                        defaultValue={product?.grammage}
                    />

                    <FormInput<FormData>
                        id={"barCode"}
                        name={"barCode"}
                        label={"Código de barras"}
                        placeholder="Ingrese el código"
                        register={register}
                        rules={{
                            required: "El código de barras es requerido",
                            pattern: {
                                value: /^[A-Za-z0-9]*$/, // Permite números y letras
                                message: "Solo se permiten números y letras"
                            }
                        }}
                        defaultValue={product?.id_code}
                    />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="tipoProducto" className="font-bold text-sm">Tipo de producto</label>
                        <select
                            id="tipoProducto"
                            className="border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                            {...register("tipoProducto", { required: "El tipo de producto es requerido" })}
                            defaultValue={product?.model}
                        >
                            <option value=''>Seleccionar</option>
                            <option value="1">Caja</option>
                            <option value="2">Bolsa</option>
                            <option value="3">Lata</option>
                            <option value="0">Otro</option>
                        </select>
                    </div>

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
                        defaultValue={product?.package_quantity}
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
                                value: /^[0-9]+(\.[0-9]{1,2})?$/, // Permite números y decimales
                                message: "Formato de precio inválido"
                            }
                        }}
                        defaultValue={product?.purchase_price}
                    />

                    <div className="mt-4 flex flex-row gap-4 justify-end w-full">
                        <button type="button" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#FFFFFF] text-[#58B7A3] rounded-lg py-2"
                            onClick={onClose}>
                            <span>Cancelar</span>
                        </button>
                        <button type="submit" className="w-[126px] font-medium border-[2px] border-[#58B7A3] bg-[#58B7A3] text-[#FFFFFF] rounded-lg py-2">
                            <span>Actualizar Producto</span>
                        </button>
                    </div>
                </form>
            </div>
        </ModalContainer>
    );
}

export default UpdateProductModal;