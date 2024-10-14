import Image from "next/image";
import { StockDataObject, usePageContext } from "./page.context";
import classNames from "classnames";
import { useEffect, useState, useCallback } from "react";
import { localStorageWrapper } from '@/utils/localStorageWrapper';
import { useForm } from 'react-hook-form';
import { registerPurchase } from '../../../../api';
import { useAppContext } from '@/hooks/useAppContext';
import { useToast } from '@/components/toasts/use-toasts';

type ProductGridProps = {
    initialSearchTerm: string;
    selectedCategory: string;
    selectedSupplier: string;
    onSearchChange: (term: string) => void;
    onCategoryChange: (category: string) => void;
    onSupplierChange: (supplier: string) => void;
};

type FormData = {
    supplier: string;
    ticket_image: FileList;
};

const ProductGrid: React.FC<ProductGridProps> = ({
    initialSearchTerm,
    selectedCategory,
    selectedSupplier,
    onSearchChange,
    onCategoryChange,
    onSupplierChange
}) => {
    const {
        products,
        currentPage,
        totalPages,
        setCurrentPage,
        fetchProducts,
        updateProduct,
        fetchSuppliers,
        suppliers,
        setFilters,
        categories
    } = usePageContext();

    const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: Partial<StockDataObject> }>({});
    const { loading, setLoading } = useAppContext();
    const { toastSuccess, toastError } = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [localSelectedSupplier, setLocalSelectedSupplier] = useState('');

    useEffect(() => {
        fetchSuppliers();
        const storedProducts = JSON.parse(localStorageWrapper.getItem('selectedProducts') || '{}');
        setSelectedProducts(storedProducts);
    }, [fetchSuppliers]);

    useEffect(() => {
        setFilters(searchTerm, selectedCategory, selectedSupplier);
    }, [searchTerm, selectedCategory, selectedSupplier, setFilters]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTerm = e.target.value;
        setSearchTerm(newTerm);
        onSearchChange(newTerm);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value;
        onCategoryChange(newCategory);
    };

    const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSupplierName = e.target.value;
        onSupplierChange(newSupplierName);
        const selectedSupplier = suppliers.find(supplier => supplier.name === newSupplierName);
        if (selectedSupplier) {
            localStorageWrapper.setItem('selectedSupplier', selectedSupplier.uuid);
        }
    };

    const handleSupplierChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSupplierName = e.target.value;
        setLocalSelectedSupplier(newSupplierName);
        const selectedSupplier = suppliers.find(supplier => supplier.name === newSupplierName);
        if (selectedSupplier) {
            localStorageWrapper.setItem('selectedSupplier', selectedSupplier.uuid);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const saveSelectedProductsToLocalStorage = useCallback((updatedProducts: { [key: string]: Partial<StockDataObject> }) => {
        localStorageWrapper.setItem('selectedProducts', JSON.stringify(updatedProducts));
    }, []);

    const handleProductChange = useCallback((productId: string, field: keyof StockDataObject, value: any) => {
        setSelectedProducts((prevSelected) => {
            const updatedSelected = { ...prevSelected };
            if (!updatedSelected[productId]) {
                updatedSelected[productId] = { uuid: productId };
            }
            updatedSelected[productId][field] = value;

            saveSelectedProductsToLocalStorage(updatedSelected);
            return updatedSelected;
        });
    }, [saveSelectedProductsToLocalStorage]);

    const toggleProductSelection = useCallback((productUuid: string) => {
        setSelectedProducts((prevSelected) => {
            const updatedSelected = { ...prevSelected };
            if (updatedSelected[productUuid]) {
                delete updatedSelected[productUuid];
            } else {
                updatedSelected[productUuid] = {
                    uuid: productUuid,
                    quantity: 0,
                    package_quantity: 0,
                    expiration: '',
                    purchase_price: 0,
                };
            }
            saveSelectedProductsToLocalStorage(updatedSelected);
            return updatedSelected;
        });
    }, [saveSelectedProductsToLocalStorage]);

    const onSubmit = async (data: FormData) => {
        setLoading(true);

        const ticketImage = data.ticket_image;
        const supplierUuid = localStorageWrapper.getItem('selectedSupplier');
        const warehousePlaceUuid = localStorageWrapper.getItem('selectedWarehousePlaceUUID');
        const productos = Object.values(selectedProducts);

        const validProducts = productos.filter((prod) => {
            const quantity = parseInt(prod.quantity as unknown as string, 10);
            const package_quantity = parseInt(prod.package_quantity as unknown as string, 10);
            const purchase_price = parseFloat(prod.purchase_price as unknown as string);

            return (
                prod.uuid &&
                quantity > 0 &&
                package_quantity > 0 &&
                prod.expiration &&
                !isNaN(purchase_price) &&
                purchase_price > 0
            );
        });

        if (validProducts.length === 0) {
            toastError({ message: "Debes seleccionar al menos un producto con información válida." });
            setLoading(false);
            return;
        }

        const simplifiedProducts = validProducts.map((prod) => ({
            product_uuid: prod.uuid,
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

        try {
            const response = await registerPurchase(formData);

            if (response.status === 404) {
                throw new Error("Producto no encontrado o endpoint incorrecto. Verifica los datos enviados.");
            }

            console.log('Purchase registered successfully:', response);
            toastSuccess({ message: "Se registró la compra con éxito" });

            localStorageWrapper.removeItem('selectedProducts');
            setSelectedProducts({});
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
                        <label className='flex flex-col md:w-[240px]'>
                            <span className='font-semibold'>Búsqueda de producto</span>
                            <input
                                type='text'
                                className='border border-gray-300 rounded-md h-[30px] p-1'
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Buscar productos..."
                            />
                        </label>
                        <br></br>
                        <label className="font-semibold text-lg">Filtrar por proveedor</label>
                        <select
                            className="border border-gray-300 rounded-md h-[30px]"
                            {...register("supplier", { required: true })}
                            onChange={handleSupplierChange}
                            value={selectedSupplier}
                        >
                            <option value="">Seleccionar</option>
                            {suppliers && suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
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
                        <label className="font-semibold text-lg">Selecciona un proveedor</label>
                        <select
                            className="border border-gray-300 rounded-md h-[30px]"
                            {...register("supplier", { required: true })}
                            onChange={handleSupplierChangeSelect}
                            value={localSelectedSupplier}
                        >
                            <option value="">Seleccionar</option>
                            {suppliers && suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                            ))}
                        </select>
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
                {products.map((product) => (
                    <div className={classNames({
                        'col-span-1 border rounded-2xl border-gray-200 hover:bg-gray-50 p-3': true,
                        'w-full': true
                    })} key={product.id}>
                        <div className="flex flex-col gap-2 leading-none">
                            <input
                                type="checkbox"
                                className="w-6 h-6 rounded-md border-gray-300 focus:ring-2 "
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
                                <span>Proveedor:</span>
                                <div>{product.supplier ? product.supplier.name : 'No especificado'}</div>
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
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                    Anterior
                </button>
                <span>{currentPage} de {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                    Siguiente
                </button>
            </div>
        </>
    );
};

export default ProductGrid;