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
    const [selectedProducts, setSelectedProducts] = useState(new Set<number>());
    const { loading, setLoading } = useAppContext();
    const { toastSuccess, toastError } = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    // Cargar datos desde localStorage al montar el componente
    useEffect(() => {
        fetchSuppliers();
        const storedProducts = JSON.parse(localStorageWrapper.getItem('selectedProducts') || '[]');
        setSelectedProducts(new Set(storedProducts.map((prod: { id: number }) => prod.id)));
        setFilteredProducts(storedProducts);
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

    const saveSelectedProductsToLocalStorage = (updatedProducts: StockDataObject[]) => {
        localStorageWrapper.setItem('selectedProducts', JSON.stringify(updatedProducts));
    };

    const toggleProductSelection = (productId: number) => {
        setSelectedProducts((prevSelected) => {
            const updatedSelected = new Set(prevSelected);
            if (updatedSelected.has(productId)) {
                updatedSelected.delete(productId);
            } else {
                updatedSelected.add(productId);
            }

            // Actualizar y guardar en localStorage
            const updatedProducts = filteredProducts.filter(product => updatedSelected.has(product.id));
            saveSelectedProductsToLocalStorage(updatedProducts);

            return updatedSelected;
        });
    };

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

    const handleChange = (index: number, field: keyof StockDataObject) => (event: React.ChangeEvent<HTMLInputElement>) => {
        updateProduct(index, field, event.target.value);
        const updatedProducts = filteredProducts.map((product, i) => {
            if (i === index) {
                return { ...product, [field]: event.target.value };
            }
            return product;
        });
        setFilteredProducts(updatedProducts);
        saveSelectedProductsToLocalStorage(updatedProducts);
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        const ticketImage = data.ticket_image;
        const supplierUuid = localStorageWrapper.getItem('selectedSupplier');
        const warehousePlaceUuid = localStorageWrapper.getItem('selectedWarehousePlaceUUID');
        let productos = JSON.parse(localStorageWrapper.getItem('selectedProducts') || '[]');

        // Solo incluye los productos que tienen todos los campos necesarios y que estén seleccionados
        const validProducts = productos.filter((prod: { id: number; quantity: string | number; package_quantity: string | number; expiration: any; purchase_price: string | number; }) => {
            const quantity = parseInt(prod.quantity as string, 10);
            const package_quantity = parseInt(prod.package_quantity as string, 10);
            const purchase_price = parseFloat(prod.purchase_price as string);
            const expiration = prod.expiration;

            return (
                selectedProducts.has(prod.id) &&  // Asegúrate de que el producto esté seleccionado
                quantity > 0 &&
                package_quantity > 0 &&
                expiration &&
                !isNaN(purchase_price) && // Verificar que purchase_price no sea NaN
                purchase_price > 0
            );
        });

        if (validProducts.length === 0) {
            toastError({ message: "Debes seleccionar al menos un producto con información válida." });
            setLoading(false);
            return;
        }

        // Simplifica los productos para enviarlos al backend
        const simplifiedProducts = validProducts.map((prod: { uuid: any; quantity: string | number; purchase_price: string | number; expiration: any; package_quantity: string | number; }) => ({
            product_uuid: prod.uuid,
            quantity: parseInt(prod.quantity as string, 10),
            purchase_price: parseFloat(prod.purchase_price as string),
            expiration: prod.expiration,
            package_quantity: parseInt(prod.package_quantity as string, 10),
        }));

        const totalAmount = simplifiedProducts.reduce((total: number, prod: { purchase_price: number; quantity: number; package_quantity: number; }) =>
            total + (prod.purchase_price * prod.quantity * prod.package_quantity), 0);

        const formData = new FormData();
        formData.append('supplier_uuid', supplierUuid || '');
        formData.append('total_amount', totalAmount.toFixed(2));
        formData.append('productos', JSON.stringify(simplifiedProducts));
        formData.append('warehouse_place_uuid', warehousePlaceUuid || '');
        formData.append('ticket_image', ticketImage[0]);

        // Log para verificar los datos que se envían
        console.log('Form Data being sent:', Array.from(formData.entries()));

        try {
            const response = await registerPurchase(formData);
            console.log('Purchase registered successfully:', response);
            toastSuccess({ message: "Se registró la compra con éxito" });
            localStorageWrapper.removeItem('selectedProducts');
            localStorageWrapper.removeItem('productList');
        } catch (error: any) {
            console.error("Error registering purchase:", error);
            toastError({ message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="gap-4 md:gap-y-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 self-center md:self-auto overflow-auto">
                {filteredProducts.map((product, index) => (
                    <div className={classNames({
                        'col-span-1 border rounded-2xl border-gray-200 hover:bg-gray-50 p-3': true,
                        'w-full': true
                    })} key={product.id + '_' + index}>
                        <div className="flex flex-col gap-2 leading-none">
                            <input
                                type="checkbox"
                                checked={selectedProducts.has(product.id)}
                                onChange={() => toggleProductSelection(product.id)}
                            />
                            <div className='flex items-center justify-center'>
                                <Image src={product.image || '/default-product.png'} alt='product image' width={60} height={80} className='w-[60px] h-[80px]' />
                            </div>
                            <div className='font-bold'>{product.name}</div>
                            <div className="flex flex-row gap-2">
                                <span className="">Stock</span>
                                <div className='' typeof="number">{product.total_stock}</div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="">Precio de venta: </span>
                                <div className='' typeof="number">${product.sale_price}</div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="">Cantidad a comprar: </span>
                                <input
                                    type="number"
                                    className="rounded-lg border border-gray-400 w-24"
                                    value={product.quantity || ''}
                                    onChange={handleChange(index, 'quantity')}
                                    disabled={!selectedProducts.has(product.id)} // Disable if not selected
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="">Cantidad por paquete: </span>
                                <input
                                    type="number"
                                    className="rounded-lg border border-gray-400 w-24"
                                    value={product.package_quantity || ''}
                                    onChange={handleChange(index, 'package_quantity')}
                                    disabled={!selectedProducts.has(product.id)} // Disable if not selected
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="">Fecha de expiración: </span>
                                <input
                                    type="date"
                                    className="rounded-lg border border-gray-400 w-24"
                                    value={product.expiration || ''}
                                    onChange={handleChange(index, 'expiration')}
                                    disabled={!selectedProducts.has(product.id)} // Disable if not selected
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="">Precio de compra: </span>
                                <input
                                    type="number"
                                    className="rounded-lg border border-gray-400 w-24"
                                    value={product.purchase_price || ''}
                                    onChange={handleChange(index, 'purchase_price')}
                                    disabled={!selectedProducts.has(product.id)} // Disable if not selected
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
        </>
    );
};

export default ProductGrid;
