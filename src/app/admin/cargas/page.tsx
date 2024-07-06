'use client';

import { useState, useEffect, SetStateAction } from 'react';
import ContextProvider, { usePageContext } from './page.context';
import ProductGrid from './purchases-grid';
import Image from 'next/image';

const UsersPage = () => {
    return (
        <ContextProvider>
            <Stock />
        </ContextProvider>
    );
};

export default UsersPage;

const Stock = () => {
    const { warehouses, fetchAllWaggons, fetchProductsByOrigin, handleConfirmLoad, categories, suppliers, setFilters, waggons, setOrigin, origin, products } = usePageContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    //const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [cash, setCash] = useState('');
    const [, setProducts] = useState<any[]>([]);

    useEffect(() => {
        if (origin) {
            fetchProductsByOrigin(origin)
                .then((data) => {
                    setProducts(Array.isArray(data) ? data : []);
                })
                .catch((error) => {
                    console.error("Error al buscar productos por origen:", error);
                    setProducts([]);
                });
        }
    }, [origin, fetchProductsByOrigin]);

    useEffect(() => {
        setFilters(searchTerm, selectedCategory, selectedSupplier);
    }, [searchTerm, selectedCategory, selectedSupplier, setFilters]);

    useEffect(() => {
        fetchAllWaggons(); // Obtener todas las camionetas al cargar el componente
    }, [fetchAllWaggons]);

    const handleSearchChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTerm(event.target.value);
    };

    const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDestination(e.target.value);
    };

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const loadData = {
            origin,
            destination,
            cash,
            products,
        };
        handleConfirmLoad(loadData);
    };

    return (
        <main className="w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
            <div className='md:container'>
                <div className='w-full h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>
                    <div className='border-b-[3px] border-b-[#2C3375] w-fit px-12 self-center'>
                        <h1 className='uppercase font-bold text-3xl'>CARGA</h1>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className='flex flex-col md:w-[240px]'>
                            <span className='font-semibold'>Origen</span>
                            <select
                                className='border border-gray-300 rounded-md h-[30px] p-1'
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                            >
                                <option value=''>Seleccionar</option>
                                {warehouses.map((warehouse) => (
                                    <option key={warehouse.uuid} value={warehouse.uuid}>
                                        {warehouse.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className='flex flex-col md:w-[240px]'>
                            <span className='font-semibold'>Destino</span>
                            <select
                                className='border border-gray-300 rounded-md h-[30px] p-1'
                                value={destination}
                                onChange={handleDestinationChange}
                            >
                                <option value=''>Seleccionar</option>
                                {waggons.map((waggon) => (
                                    <option key={waggon.uuid} value={waggon.uuid}>
                                        {waggon.plate}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className='flex flex-col md:w-[240px]'>
                            <span className='font-semibold'>Efectivo</span>
                            <input
                                type="number"
                                className='border border-gray-300 rounded-md h-[30px] p-1'
                                value={cash}
                                onChange={(e) => setCash(e.target.value)}
                            />
                        </label>
                        <div className='flex flex-row gap-3 items-center'>
                            <div className='flex flex-row gap-3 flex-wrap'>
                                <label className='flex flex-col md:w-[240px]'>
                                    <span className='font-semibold'>Búsqueda de producto</span>
                                    <input
                                        type='text'
                                        className='border border-gray-300 rounded-md h-[30px] p-1'
                                        value={searchTerm}
                                        onChange={handleSearchChange}
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
                            </div>
                            <div className='visible xl:hidden w-[40px] h-[40px] ml-6'>
                                <CartButton />
                            </div>
                        </div>
                        <section>
                            <ProductGrid products={products} />
                        </section>
                    </form>
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
