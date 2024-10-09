'use client';

import { Metadata } from 'next';
import { ContextProvider, usePageContext } from './page.context';
import ProductGrid from './purchases-grid';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { localStorageWrapper } from '@/utils/localStorageWrapper';
import { registerPurchase } from '../../../../api';
import { useAppContext } from '@/hooks/useAppContext';
import { useToast } from '@/components/toasts/use-toasts';

const UsersPage = () => {
    return (
        <ContextProvider>
            <Stock />
        </ContextProvider>
    );
};
export default UsersPage;

type FormData = {
    supplier: string;
    ticket_image: FileList;
}

const Stock = () => {
    const { openCart, fetchSuppliers, suppliers, setFilters, products } = usePageContext();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { setValue, register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const { loading, setLoading } = useAppContext();
    const { toastSuccess, toastError } = useToast();
    const [productList, setProductList] = useState(products);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    useEffect(() => {
        updatelocalStorageWrapper(productList);
    }, [productList]);

    const updatelocalStorageWrapper = (products: any[]) => {
        const formattedProducts = products.map(product => ({
            product_uuid: product.uuid,
            buying_price: parseFloat(product.purchase_price?.toString() || '0'),
            quantity: parseInt(product.quantity?.toString() || '0', 10),
            expiration: product.expiration,
            package_quantity: parseInt(product.package_quantity?.toString() || '1', 10) || 1,
        }));
        localStorageWrapper.setItem('productList', JSON.stringify(formattedProducts));
    };

    useEffect(() => {
        setFilters(searchTerm, selectedCategory, selectedSupplier);
    }, [searchTerm, selectedCategory, selectedSupplier, setFilters]);

    const handleSupplierChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSupplier = suppliers.find(supplier => supplier.id === parseInt(event.target.value, 10));
        if (selectedSupplier) {
            localStorageWrapper.setItem('selectedSupplier', selectedSupplier.uuid);
        }
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        const ticketImage = data.ticket_image;
        const supplierUuid = localStorageWrapper.getItem('selectedSupplier');
        const warehousePlaceUuid = localStorageWrapper.getItem('selectedWarehousePlaceUUID');
        const productos = JSON.parse(localStorageWrapper.getItem('productList') || '[]');

        const totalAmount = productos.reduce((total: number, prod: { buying_price: number; quantity: number; package_quantity: number; }) =>
            total + (prod.buying_price * prod.quantity * prod.package_quantity), 0);

        const formData = new FormData();
        formData.append('supplier_uuid', supplierUuid || '');
        formData.append('total_amount', totalAmount.toString());
        formData.append('productos', JSON.stringify(productos));
        formData.append('warehouse_place_uuid', warehousePlaceUuid || '');
        formData.append('ticket_image', ticketImage[0]);

        try {
            await registerPurchase(formData);
            toastSuccess({ message: "Se registro la compra" });
            localStorageWrapper.removeItem('productList');
            localStorageWrapper.removeItem('registeredProducts');
        } catch (error: any) {
            toastError({ message: error.message });
            console.error("Error registering purchase:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
            <div className='md:container'>
                <div className='w-full h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>
                    <div className='border-b-[3px] border-b-[#2C3375] w-fit px-12 self-center'>
                        <h1 className='uppercase font-bold text-3xl'>COMPRA DE PRODUCTOS</h1>
                    </div>
                    <section>
                        <ProductGrid 
                            initialSearchTerm={searchTerm} 
                            selectedCategory={selectedCategory} 
                            selectedSupplier={selectedSupplier} 
                            onSearchChange={setSearchTerm}
                            onCategoryChange={setSelectedCategory}
                            onSupplierChange={setSelectedSupplier}
                        />
                    </section>
                </div>
            </div>
        </main>
    );
};

function CartButton() {
    const { openCart } = usePageContext();

    return (
        <button type='button' onClick={openCart}>
            <Image src='/img/actions/cart.svg' alt='go to cart icon' width={32} height={32} className='w-[24px] h-[24px] self-start' />
        </button>
    );
}