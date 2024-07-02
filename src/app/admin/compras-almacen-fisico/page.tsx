'use client';

import { Metadata } from 'next';
import { ContextProvider, usePageContext } from './page.context';
import ProductGrid from './purchases-grid';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const UsersPage = () => {
    return (
        <ContextProvider>
            <Stock />
        </ContextProvider>
    );
};
export default UsersPage;

const Stock = () => {
    const { openCart, categories, suppliers, fetchProducts, setFilters } = usePageContext();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setFilters(searchTerm, selectedCategory, selectedSupplier);
    }, [searchTerm, selectedCategory, selectedSupplier, setFilters]);

    return (
        <main className="w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
            <div className='md:container'>
                <div className='w-full h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>
                    <div className='border-b-[3px] border-b-[#2C3375] w-fit px-12 self-center'>
                        <h1 className='uppercase font-bold text-3xl'>COMPRA</h1>
                    </div>
                    <div>
                        <h2 className='font-bold text-xl'>Lista de productos</h2>
                    </div>
                    <div className='flex flex-row gap-3 items-center'>
                        <div className='flex flex-row gap-3 flex-wrap'>
                            <label className='flex flex-col md:w-[240px]'>
                                <span className='font-semibold'>Búsqueda de producto</span>
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
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value=''>Seleccionar</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </label>
                            <label className='flex flex-col min-w-[140px] md:w-[240px]'>
                                <span className='font-semibold'>Proveedor</span>
                                <select
                                    className='border border-gray-300 rounded-md h-[30px]'
                                    value={selectedSupplier}
                                    onChange={(e) => setSelectedSupplier(e.target.value)}
                                >
                                    <option value=''>Seleccionar</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier} value={supplier}>{supplier}</option>
                                    ))}
                                </select>
                            </label>
                            <div className='hidden xl:block w-[40px] h-[40px] ml-6'>
                                <CartButton />
                            </div>
                        </div>
                        <div className='visible xl:hidden w-[40px] h-[40px] ml-6'>
                            <CartButton />
                        </div>
                    </div>
                    <section>
                        <ProductGrid />
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
