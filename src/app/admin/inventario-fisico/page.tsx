'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ContextProvider, usePageContext } from './page.context';
import DataTable from './table/data-table';
import { APP_ROUTES } from '@/constants';
import { localStorageWrapper } from '@/utils/localStorageWrapper';

export default function UsersPage() {
    return (
        <ContextProvider>
            <Stock />
        </ContextProvider>
    );
}

const Stock = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { categories, setCategoryFilter, filteredProducts, openCart } = usePageContext();

    // Suponiendo que tienes el UUID del almacén cargado desde tu contexto o prop
    const currentWarehouseUUID = localStorageWrapper.getItem('selectedWarehousePlaceUUID'); // Puedes setearlo previamente.

    const handleNavigateToPurchase = () => {
        if (currentWarehouseUUID) {
            localStorageWrapper.setItem('selectedWarehousePlaceUUID', currentWarehouseUUID);
        }
    };

    const handleCategoryChange = (event: { target: { value: string; }; }) => {
        setCategoryFilter(event.target.value);
    };

    return (
        <main className="w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
            <div className='md:container'>
                <div className='w-full h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>
                    <div className='border-b-[3px] border-b-[#2C3375] w-fit px-12 self-center'>
                        <h1 className='uppercase font-bold text-3xl'>Almacen físico</h1>
                    </div>
                    <div>
                        <h2 className='font-bold text-xl'>Lista de productos en existencia</h2>
                    </div>
                    <div className='flex flex-wrap items-center justify-between'>
                        <div className='flex flex-row gap-3 flex-wrap'>
                            {/* filters */}
                            <label className='flex flex-col md:w-[260px]'>
                                <span className='font-semibold'>Búsqueda de productos en stock</span>
                                <input
                                    type='text'
                                    className='border border-gray-300 rounded-md h-[30px] p-1'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </label>
                            <label className='flex flex-col min-w-[140px] md:w-[240px]'>
                                <span className='font-semibold'>Clasificación</span>
                                <select
                                    className='border border-gray-300 rounded-md h-[30px]'
                                    onChange={handleCategoryChange}
                                >
                                    <option value=''>Todas</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className='flex flex-col items-end'>
                            <span className='font-semibold'>Realizar compra de productos</span>
                            <br />
                            <div className='flex items-center gap-2'>
                                <div className='hidden xl:block w-[130px] h-[40px] ml-30 mr-100'>
                                    {/* btn desktop */}
                                    <CartButton />
                                </div>
                                <Link href={APP_ROUTES.ADMIN.PURCHASE_STOCK_MACHINE}>
                                    <button
                                        onClick={() => {
                                            handleNavigateToPurchase();  // Guardar UUID
                                            openCart();
                                        }}
                                        className='bg-[#2C3375] text-white rounded-md px-4 py-2 hidden xl:inline-block ml-0 mr-15'
                                    >
                                        Realizar compra
                                    </button>
                                </Link>
                            </div>
                            <div className='flex flex-col min-w-[140px] md:w-[240px] mt-2'>
                                <label className='font-semibold'>
                                    Valor actual del inventario: ${filteredProducts.reduce((acc, item) => acc + item.investment, 0).toFixed(2)}
                                </label>
                            </div>
                        </div>
                    </div>
                    <section>
                        {/* table */}
                        <DataTable searchTerm={searchTerm} />
                    </section>
                </div>
            </div>
        </main>
    );
};

function CartButton() {
    const { openCart } = usePageContext();

    return (
        <Link href={APP_ROUTES.ADMIN.PURCHASE_STOCK_MACHINE} className='w-2/3 md:w-[30%]'>
            <button type='button' onClick={openCart}>
                <Image src='/img/actions/cart.svg' alt='go to cart icon' width={32} height={32} className='w-[24px] h-[24px] self-start ml-20 mt-2' />
            </button>
        </Link>
    );
}
