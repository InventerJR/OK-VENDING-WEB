import Image from "next/image";
import { StockDataObject, usePageContext } from "./page.context";
import classNames from "classnames";
import { useEffect, useState, useCallback } from "react";
import { localStorageWrapper } from '@/utils/localStorageWrapper';
import { useForm } from 'react-hook-form';
import { useAppContext } from '@/hooks/useAppContext';
import { useToast } from '@/components/toasts/use-toasts';
import ConfirmPurchaseModal from "./cart/confirm-purchase-modal";
import NavigationWarningModal from "./navigation-warning-modal";
import { useNavigation } from "@/hooks/navigation-context";

type ProductGridProps = {
    initialSearchTerm: string;
    selectedCategory: string;
    selectedSupplier: string;
    onSearchChange: (term: string) => void;
    onCategoryChange: (category: string) => void;
    onSupplierChange: (supplier: string) => void;
};

export type FormData = {
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
        fetchSuppliers,
        suppliers,
        setFilters,
        categories,
        isNewWarehouse,
    } = usePageContext();

    const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: Partial<StockDataObject> }>({});
    const { loading, setLoading } = useAppContext();
    const { toastError } = useToast();
    const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>();
    const { setShowNavigationWarning } = useNavigation();
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [localSelectedSupplier, setLocalSelectedSupplier] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormData | null>(null);

    useEffect(() => {
        const savedSupplier = localStorage.getItem('selectedFilterSupplier');
        if (savedSupplier) {
            setLocalSelectedSupplier(savedSupplier);
            onSupplierChange(savedSupplier);
            setValue('supplier', savedSupplier);
        }
    }, []);

    useEffect(() => {
        if (isNewWarehouse && suppliers.length > 0) {
            const defaultSupplierName = 'OkVending';
            setLocalSelectedSupplier(defaultSupplierName);
            setValue('supplier', defaultSupplierName); // Aquí aseguramos que también se registre en el formulario
        }
    }, [isNewWarehouse, suppliers, setValue]);

    const handleOpenModal = (data: FormData) => {
        if (Object.keys(selectedProducts).length === 0) {
            toastError({ message: "Debes seleccionar al menos un producto para realizar una compra." });
            return;
        }

        setFormData(data);
        setModalOpen(true);
    };


    useEffect(() => {
        fetchSuppliers();
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
        setLocalSelectedSupplier(newSupplierName);
        setValue('supplier', newSupplierName);
        onSupplierChange(newSupplierName);
        localStorage.setItem('selectedFilterSupplier', newSupplierName);
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

    const handleProductChange = (productId: string, field: keyof StockDataObject, value: any) => {
        setSelectedProducts((prevSelected) => ({
            ...prevSelected,
            [productId]: {
                ...prevSelected[productId],
                [field]: value,
            },
        }));
    };

    const toggleProductSelection = useCallback((productUuid: string) => {
        setSelectedProducts((prevSelected) => {
            const updatedSelected = { ...prevSelected };
            const product = products.find((prod) => prod.uuid === productUuid);

            if (updatedSelected[productUuid]) {
                delete updatedSelected[productUuid];
            } else if (product) {
                updatedSelected[productUuid] = {
                    uuid: productUuid,
                    name: product.name,
                    image: product.image,
                    quantity: 0,
                    package_quantity: product.package_quantity || 1,
                    expiration: '',
                    purchase_price: 0,
                };
            }
            return updatedSelected;
        });
    }, [products]);

    useEffect(() => {
        if (Object.keys(selectedProducts).length > 0) {
            localStorage.setItem('selectedProducts', 'true');
            localStorage.setItem('lastPath', '/admin/compras-almacen-fisico');
        } else {
            localStorage.removeItem('selectedProducts');
            localStorage.removeItem('lastPath');
        }
    }, [selectedProducts]);

    const handleConfirmNavigation = () => {
        setSelectedProducts({});
        setShowNavigationWarning(false);
        localStorage.removeItem('selectedProducts');
        localStorage.removeItem('lastPath');
    };

    const handleCancelNavigation = () => {
        setShowNavigationWarning(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit(handleOpenModal)} className="flex flex-col gap-4 mt-6">
                <div className="flex justify-between items-start w-full p-4">
                    <div className='flex flex-col items-start'>
                        <label className='flex flex-col md:w-[240px]'>
                            <span className='font-semibold'>Búsqueda de producto</span>
                            <input
                                type='text'
                                className='border border-gray-300 rounded-md h-[30px] p-1'
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Buscar productos ..."
                            />
                        </label>
                        <br></br>
                        <label className="font-semibold text-lg">Filtrar por proveedor</label>
                            <select
                                className="border border-gray-300 rounded-md h-[30px]"
                                {...register("supplier", { required: true })}
                                onChange={handleSupplierChange}
                                value={localSelectedSupplier || ""}
                            >
                                <option value="">Seleccionar</option>
                                {suppliers && suppliers.map((supplier) => (
                                    <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
                                ))}
                            </select>
                            {selectedSupplier && products.length === 0 && (
                                <span className="text-red-500 mt-2">Este proveedor aún no tiene productos cargados</span>
                            )}
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
                            {isNewWarehouse ? (
                                <option value="OkVending">OkVending (Default)</option>
                            ) : (
                                <option value="">Seleccionar</option> // Si no es nuevo, opción por defecto vacía
                            )}
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.name}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                        {errors.supplier && <span className="text-red-500">Este campo es requerido</span>}
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-[#58B7A3] text-white rounded-lg py-2 px-10"
                    >
                        Guardar compra
                    </button>
                </div>
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
                                <div typeof="number">{product.stock}</div>
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
            <ConfirmPurchaseModal
                isOpen={isModalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedProducts({});
                }}
                selectedProducts={selectedProducts}
                formData={formData as FormData}
            />
            <NavigationWarningModal
                hasSelectedProducts={Object.keys(selectedProducts).length > 0}
                onConfirm={handleConfirmNavigation}
                onCancel={handleCancelNavigation}
            />
        </>
    );
};

export default ProductGrid;