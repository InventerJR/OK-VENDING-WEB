'use client';

import { Input } from '@/components/input'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'
import { ContextProvider, usePageContext } from './page.context'
import ProductGrid from './purchases-grid';
import DataTable from './table/data-table';
import { APP_ROUTES } from '@/constants';

const UsersPage = () => {
    return (
        <ContextProvider>
            <Stock />
        </ContextProvider>
    )
}
export default UsersPage;




const Stock = () => {
    const { openCart } = usePageContext();

    const showCart = () => {
        console.log('show cart')
        openCart()
    }


    return (
        <main className=" w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
            <div className='md:container'>
                <div className='w-full h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>

                    <div className='border-b-[3px] border-b-[#2C3375] w-fit px-12 self-center'>
                        <h1 className='uppercase font-bold text-3xl'>Almacenes</h1>
                    </div>

                    <div>
                        <h2 className='font-bold text-xl'>Lista de productos</h2>
                    </div>


                    <div className='flex flex-row gap-3 items-center'>
                        <div className='flex flex-row gap-3 flex-wrap'>
                            {/* filters */}
                            <label className='flex flex-col md:w-[240px]'>
                                <span className='font-semibold'>Búsqueda de producto</span>
                                <input type='text' className='border border-gray-300 rounded-md h-[30px] p-1' />
                            </label>
                            <label className='flex flex-col min-w-[140px] md:w-[240px]'>
                                <span className='font-semibold'>Clasificación</span>
                                <select className='border border-gray-300 rounded-md h-[30px]'>
                                    <option value=''>Seleccionar</option>
                                    <option value='admin'>A</option>
                                    <option value='supervisor'>B</option>
                                    <option value='supervisor'>C</option>
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
                        </div>
                    </div>

                    <section className=''>
                        {/* table */}
                        {/* table headers: Nombre | Teléfono | Email | Tipo | Actions*/}
                        {/* pager */}


                        <DataTable />
                    </section>

                </div>
            </div>
        </main>
    );
};
