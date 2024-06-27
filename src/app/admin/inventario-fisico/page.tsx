'use client';

import { Input } from '@/components/input'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SetStateAction, use, useState } from 'react'
import { ContextProvider, usePageContext } from '../equipos/page.context'
import DataTable from './table/data-table';
import { APP_ROUTES } from '@/constants';
//import ProductGrid from './purchases-grid';

export default function UsersPage() {
    return (
        <ContextProvider>
            <Stock />
        </ContextProvider>
    )
}


const Stock = () => {
    const { openCart } = usePageContext();
    const [searchTerm, setSearchTerm] = useState(""); // Paso 2: Crear el estado searchTerm

    // Paso 3: Crear el manejador de eventos para actualizar searchTerm
    const handleSearchChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTerm(event.target.value);
    };

    const showCart = () => {
        console.log('show cart')
        openCart()
    }

    return (
        <main className=" w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
            <div className='md:container'>
                <div className='w-full h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>

                    <div className='border-b-[3px] border-b-[#2C3375] w-fit px-12 self-center'>
                        <h1 className='uppercase font-bold text-3xl'>Inventario Almacen</h1>
                    </div>

                    <div>
                        <h2 className='font-bold text-xl'>Lista de productos</h2>
                    </div>


                    <div className='flex flex-row gap-3 items-center'>
                        <div className='flex flex-row gap-3 flex-wrap'>
                            {/* filters */}
                            <label className='flex flex-col md:w-[240px]'>
                                <span className='font-semibold'>Búsqueda de producto</span>
                                <input type='text' className='border border-gray-300 rounded-md h-[30px] p-1' onChange={handleSearchChange}/>
                            </label>
                            <label className='flex flex-col min-w-[140px] md:w-[240px]'>
                                <span className='font-semibold'>Clasificación</span>
                                <select className='border border-gray-300 rounded-md h-[30px]'>
                                    <option value=''>Seleccionar</option>
                                    <option value='admin'>Pet</option>
                                    <option value='supervisor'>Bolsa</option>
                                    <option value='supervisor'>lata</option>
                                    <option value='supervisor'>Caja</option>
                                    <option value='supervisor'>Vidrio</option>
                                </select>
                            </label>
                            <label className='flex flex-col min-w-[140px] md:w-[240px]'>
                                <span className='font-semibold'>Proveedor</span>
                                <select className='border border-gray-300 rounded-md h-[30px]'>
                                    <option value=''>Seleccionar</option>
                                    <option value='admin'>A</option>
                                    <option value='supervisor'>B</option>
                                    <option value='supervisor'>C</option>
                                </select>
                            </label>
                            <div className='hidden xl:block w-[40px] h-[40px] ml-6'>
                                {/* btn desktop */}
                                <CartButton />
                            </div>
                        </div>
                        <div className='visible xl:hidden w-[40px] h-[40px] ml-6'>
                            {/* btn mobile */}
                            <CartButton />
                        </div>
                    </div>

                    <section className=''>
                        {/* table */}
                        {/* table headers: Nombre | Teléfono | Email | Tipo | Actions*/}
                        {/* pager */}


                        {/*<ProductGrid />*/}
                        <DataTable searchTerm={searchTerm}/>
                    </section>

                </div>
            </div>
        </main>
    )
}



function CartButton() {
    const { openCart } = usePageContext();

    return (
        <Link href={APP_ROUTES.ADMIN.PURCHASE_STOCK_MACHINE} className='w-2/3 md:w-[30%]'>
            <button type='button' onClick={openCart}>
                <Image src='/img/actions/cart.svg' alt='go to cart icon' width={32} height={32} className='w-[24px] h-[24px] self-start' />
            </button>
        </Link>
    )
}