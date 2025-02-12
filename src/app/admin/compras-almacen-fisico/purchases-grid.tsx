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
import Link from "next/link";
import { APP_ROUTES } from "@/constants";
import { getWarehousesByUser } from "../../../../api";

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
    const [warehouses, setWarehouses] = useState<any[]>([]);

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
                    loose_pieces: 0,
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

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const response = await getWarehousesByUser();
                if (response && response.results) {
                    setWarehouses(response.results);
                }
            } catch (error) {
                console.error("Error al obtener almacenes:", error);
                toastError({ message: "Error al cargar los almacenes" });
            }
        };
        fetchWarehouses();
    }, [toastError]);

    const handleWarehouseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUUID = event.target.value;
        localStorageWrapper.setItem('selectedWarehousePlaceUUID', selectedUUID);
        window.location.reload();
    };

    return (
        <>
            <form onSubmit={handleSubmit(handleOpenModal)} className="flex flex-col gap-4 mt-6">

                {/* Botón de regreso y selector de almacén */}
                <div className='flex justify-between items-center mb-4'>
                    <Link href={APP_ROUTES.ADMIN.STOCK_WAREHOUSE} className="flex items-center text-[#2C3375]">
                        <Image src="/img/actions/back.png" alt="Regresar" width={24} height={24} />
                        <span className="ml-2">Regresar al Inventario</span>
                    </Link>
                    <div className='flex flex-col items-start'>
                    <span className='font-semibold text-left text-lg'>Lista de almacenes</span>
                    <select
                        onChange={handleWarehouseChange}
                        value={localStorageWrapper.getItem('selectedWarehousePlaceUUID') || ''}
                        className="border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Seleccionar almacén</option>
                        {Array.isArray(warehouses) && warehouses.map((warehouse) => (
                            <option key={warehouse.uuid} value={warehouse.uuid}>
                                {warehouse.name}
                            </option>
                        ))}
                    </select>
                    </div>
                </div>


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
            <div className="gap-2 md:gap-y-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 self-center md:self-auto overflow-auto">
                {products.map((product) => (
                    <div className={classNames({
                        'col-span-1 border rounded-2xl border-gray-200 hover:bg-gray-50 p-4': true,
                        'w-full flex flex-col gap-3': true
                    })} key={product.id}>
                        <div className="flex flex-col gap-3 leading-none">
                            <div className="flex justify-between items-start">
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 rounded-md border-gray-300 focus:ring-2"
                                    checked={!!selectedProducts[product.uuid]}
                                    onChange={() => toggleProductSelection(product.uuid)}
                                />
                            </div>
                            <div className='flex justify-center items-center h-[80px]'>
                                <Image src={product.image || '/default-product.png'} alt='product image' width={60} height={80} className='object-contain' />
                            </div>
                            <div className='font-bold text-center'>{product.name}</div>
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="w-1/2">Stock:</span>
                                    <div className="w-1/2 text-right">{product.stock}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="w-1/2">Precio de venta:</span>
                                    <div className="w-1/2 text-right">${product.sale_price}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="w-1/2">Proveedor:</span>
                                    <div className="w-1/2 text-right">{product.supplier ? product.supplier.name : 'No especificado'}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="w-1/2">Cantidad de paquetes:</span>
                                    <input
                                        type="number"
                                        className="w-20 rounded-lg border border-gray-400 text-right px-2"
                                        value={selectedProducts[product.uuid]?.quantity || ''}
                                        onChange={(e) => handleProductChange(product.uuid, 'quantity', e.target.value)}
                                        disabled={!selectedProducts[product.uuid]}
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="w-1/2">Cantidad por paquete:</span>
                                    <input
                                        type="number"
                                        className="w-20 rounded-lg border border-gray-400 text-right px-2"
                                        value={selectedProducts[product.uuid]?.package_quantity || ''}
                                        onChange={(e) => handleProductChange(product.uuid, 'package_quantity', e.target.value)}
                                        disabled={!selectedProducts[product.uuid]}
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="w-1/2">Piezas unitarias:</span>
                                    <input
                                        type="number"
                                        className="w-20 rounded-lg border border-gray-400 text-right px-2"
                                        value={selectedProducts[product.uuid]?.loose_pieces || ''}
                                        onChange={(e) => handleProductChange(product.uuid, 'loose_pieces', e.target.value)}
                                        disabled={!selectedProducts[product.uuid]}
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="w-1/2">Fecha de expiración:</span>
                                    <input
                                        type="date"
                                        className="w-20 rounded-lg border border-gray-400 text-right px-2"
                                        value={selectedProducts[product.uuid]?.expiration || ''}
                                        onChange={(e) => handleProductChange(product.uuid, 'expiration', e.target.value)}
                                        disabled={!selectedProducts[product.uuid]}
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="w-1/2">Precio de compra:</span>
                                    <input
                                        type="number"
                                        className="w-20 rounded-lg border border-gray-400 text-right px-2"
                                        value={selectedProducts[product.uuid]?.purchase_price || ''}
                                        onChange={(e) => handleProductChange(product.uuid, 'purchase_price', e.target.value)}
                                        disabled={!selectedProducts[product.uuid]}
                                    />
                                </div>
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