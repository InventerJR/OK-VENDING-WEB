import Image from "next/image";
import { StockDataObject, usePageContext } from "./page.context";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { localStorageWrapper } from '@/utils/localStorageWrapper';
import { useForm } from 'react-hook-form';
import { registerPurchase } from '../../../../api';
import { useAppContext } from '@/hooks/useAppContext';
import { useToast } from '@/components/toasts/use-toasts';

type ProductGridProps = {
    searchTerm: string;
    selectedCategory: string;
    selectedSupplier: string;
};

type FormData = {
    supplier: string;
    ticket_image: FileList;
};

const ProductGrid: React.FC<ProductGridProps> = ({ searchTerm, selectedCategory, selectedSupplier }) => {
    const { products, currentPage, totalPages, setCurrentPage, nextUrl, prevUrl, fetchProducts, updateProduct, fetchSuppliers, suppliers } = usePageContext();
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: Partial<StockDataObject> }>({});
    const { loading, setLoading } = useAppContext();
    const { toastSuccess, toastError } = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

     // Cargar datos desde localStorage al montar el componente
     useEffect(() => {
        fetchSuppliers();
        const storedProducts = JSON.parse(localStorageWrapper.getItem('selectedProducts') || '{}');
        setSelectedProducts(storedProducts);
    }, []);

    useEffect(() => {
        let filtered = products;
        if (searchTerm) {
            filtered = filtered.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (selectedCategory) {
            filtered = filtered.filter(product => product.clasification === selectedCategory);
        }
        if (selectedSupplier) {
            filtered = filtered.filter(product => product.provider === selectedSupplier);
        }
        setFilteredProducts(filtered);
    }, [searchTerm, selectedCategory, selectedSupplier, products]);

    const saveSelectedProductsToLocalStorage = (updatedProducts: { [key: string]: Partial<StockDataObject> }) => {
        localStorageWrapper.setItem('selectedProducts', JSON.stringify(updatedProducts));
    };

    // Manejar los cambios en los productos seleccionados
    const handleProductChange = (productId: string, field: keyof StockDataObject, value: any) => {
        setSelectedProducts((prevSelected) => {
            const updatedSelected = { ...prevSelected };
            if (!updatedSelected[productId]) {
                updatedSelected[productId] = { uuid: productId };
            }
            updatedSelected[productId][field] = value;

            saveSelectedProductsToLocalStorage(updatedSelected);
            return updatedSelected;
        });
    };

    const toggleProductSelection = (productUuid: string) => {
        setSelectedProducts((prevSelected) => {
            const updatedSelected = { ...prevSelected };

            if (updatedSelected[productUuid]) {
                console.log("Desabilitar")
                delete updatedSelected[productUuid]; // Deselecciona el producto
            } else {
                console.log("Habilitar")
                updatedSelected[productUuid] = {
                    uuid: productUuid,
                    quantity: 0,
                    package_quantity: 0,
                    expiration: '',
                    purchase_price: 0,
                }; // Inicializa el producto seleccionado con valores vacíos
            }

            saveSelectedProductsToLocalStorage(updatedSelected);
            return updatedSelected;
        });
    };

    useEffect(() => {
        console.log(selectedProducts)
    },["selectedProducts"]);

    const handlePageChange = (url: string | null, newPage: number) => {
        if (url) {
            fetchProducts(url);
            setCurrentPage(newPage);
        }
    };

    const handleSupplierChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSupplier = suppliers.find(supplier => supplier.id === parseInt(event.target.value, 10));
        if (selectedSupplier) {
            localStorageWrapper.setItem('selectedSupplier', selectedSupplier.uuid);
        }
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
    
        // Obtener datos del formulario
        const ticketImage = data.ticket_image;
        const supplierUuid = localStorageWrapper.getItem('selectedSupplier');
        const warehousePlaceUuid = localStorageWrapper.getItem('selectedWarehousePlaceUUID');
        const productos = Object.values(selectedProducts);
    
        // Filtrar productos válidos
        const validProducts = productos.filter((prod) => {
            const product_uuid =  prod.uuid;
            const quantity = parseInt(prod.quantity as unknown as string, 10);
            const package_quantity = parseInt(prod.package_quantity as unknown as string, 10);
            const purchase_price = parseFloat(prod.purchase_price as unknown as string);
            const expiration = prod.expiration;
    
            return (
                product_uuid &&
                quantity > 0 &&
                package_quantity > 0 &&
                expiration &&
                !isNaN(purchase_price) &&
                purchase_price > 0
            );
        });
    
        if (validProducts.length === 0) {
            toastError({ message: "Debes seleccionar al menos un producto con información válida." });
            setLoading(false);
            return;
        }
    
        // Verifica que los IDs de productos existan
        const simplifiedProducts = validProducts.map((prod) => ({
            product_uuid: prod.uuid, // Asegúrate de que el ID sea correcto
            quantity: parseInt(prod.quantity as unknown as string, 10),
            purchase_price: parseFloat(prod.purchase_price as unknown as string),
            expiration: prod.expiration,
            package_quantity: parseInt(prod.package_quantity as unknown as string, 10),
        }));
    
        const totalAmount = simplifiedProducts.reduce((total, prod) =>
            total + (prod.purchase_price * prod.quantity * prod.package_quantity), 0);
    
        const formData = new FormData();
        formData.append('supplier_uuid', supplierUuid || '');
        formData.append('total_amount', totalAmount.toFixed(2));
        formData.append('productos', JSON.stringify(simplifiedProducts));
        formData.append('warehouse_place_uuid', warehousePlaceUuid || '');
        formData.append('ticket_image', ticketImage[0]);
    
        console.log('Form Data being sent:', Array.from(formData.entries()));
    
        try {
            const response = await registerPurchase(formData);
    
            // Verifica el estado de la respuesta
            if (response.status === 404) {
                throw new Error("Producto no encontrado o endpoint incorrecto. Verifica los datos enviados.");
            }
    
            console.log('Purchase registered successfully:', response);
            toastSuccess({ message: "Se registró la compra con éxito" });
    
            localStorageWrapper.removeItem('selectedProducts');
        } catch (error: any) {
            console.error("Error registering purchase:", error);
            toastError({ message: error.message || "Error desconocido al registrar la compra." });
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-6">
                <div className="flex justify-between items-start w-full p-4">
                    <div className='flex flex-col items-start'>
                        <label className="font-semibold text-lg">Selecciona un proveedor</label>
                        <select
                            className="border border-gray-300 rounded-md h-[30px]"
                            {...register("supplier", { required: true })}
                            onChange={handleSupplierChange}
                        >
                            <option value="">Seleccionar</option>
                            {suppliers && suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                            ))}
                        </select>
                        {errors.supplier && <span className="text-red-500">Este campo es requerido</span>}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        <label className="font-semibold text-lg">Ticket Image</label>
                        <input
                            type="file"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            {...register("ticket_image", { required: true })}
                        />
                        {errors.ticket_image && (
                            <span className="text-red-500 text-sm mt-1">Este campo es requerido</span>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-[#58B7A3] text-white rounded-lg py-2 px-4 w-full"
                >
                    Guardar
                </button>
            </form>
            <br />
            <div className="gap-4 md:gap-y-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 self-center md:self-auto overflow-auto">
                {filteredProducts.map((product) => (
                    <div className={classNames({
                        'col-span-1 border rounded-2xl border-gray-200 hover:bg-gray-50 p-3': true,
                        'w-full': true
                    })} key={product.id}>
                        <div className="flex flex-col gap-2 leading-none">
                            <input
                                type="checkbox"
                                checked={!!selectedProducts[product.uuid]}
                                onChange={() => toggleProductSelection(product.uuid)}
                            />
                            <div className='flex items-center justify-center'>
                                <Image src={product.image || '/default-product.png'} alt='product image' width={60} height={80} className='w-[60px] h-[80px]' />
                            </div>
                            <div className='font-bold'>{product.name}</div>
                            <div className="flex flex-row gap-2">
                                <span>Stock</span>
                                <div typeof="number">{product.total_stock}</div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span>Precio de venta:</span>
                                <div typeof="number">${product.sale_price}</div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span>Cantidad a comprar:</span>
                                <input
                                    type="number"
                                    className="rounded-lg border border-gray-400 w-24"
                                    value={selectedProducts[product.uuid]?.quantity || ''}
                                    onChange={(e) => handleProductChange(product.uuid, 'quantity', e.target.value)}
                                    disabled={!selectedProducts[product.uuid]}
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <span>Cantidad por paquete:</span>
                                <input
                                    type="number"
                                    className="rounded-lg border border-gray-400 w-24"
                                    value={selectedProducts[product.uuid]?.package_quantity || ''}
                                    onChange={(e) => handleProductChange(product.uuid, 'package_quantity', e.target.value)}
                                    disabled={!selectedProducts[product.uuid]}
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <span>Fecha de expiración:</span>
                                <input
                                    type="date"
                                    className="rounded-lg border border-gray-400 w-24"
                                    value={selectedProducts[product.uuid]?.expiration || ''}
                                    onChange={(e) => handleProductChange(product.uuid, 'expiration', e.target.value)}
                                    disabled={!selectedProducts[product.uuid]}
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <span>Precio de compra:</span>
                                <input
                                    type="number"
                                    className="rounded-lg border border-gray-400 w-24"
                                    value={selectedProducts[product.uuid]?.purchase_price || ''}
                                    onChange={(e) => handleProductChange(product.uuid, 'purchase_price', e.target.value)}
                                    disabled={!selectedProducts[product.uuid]}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex gap-2 mt-4">
                <button
                    disabled={!prevUrl}
                    onClick={() => handlePageChange(prevUrl, currentPage - 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                    Anterior
                </button>
                <button
                    disabled={!nextUrl}
                    onClick={() => handlePageChange(nextUrl, currentPage + 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                    Siguiente
                </button>
            </div>
        </>
    );
};

export default ProductGrid;
