'use client';

import { useState, useEffect, SetStateAction } from 'react';
import ContextProvider, { usePageContext } from './page.context';
import ProductGrid from './purchases-grid'; 
import Image from 'next/image';
import { loadWaggon } from '../../../../apiDono';

const UsersPage = () => {
    return (
        <ContextProvider>
            <Load />
        </ContextProvider>
    );
};

export default UsersPage;

const Load = () => {
    const { warehouses, fetchAllWaggons, waggons, setOrigin, origin, products, setDestination, destination, cash, setCash, quantities, setQuantities, fetchProductsByOrigin } = usePageContext();

    useEffect(() => {
        fetchAllWaggons(); 
    }, [fetchAllWaggons]);

    useEffect(() => {
        if (origin) {
            fetchProductsByOrigin(origin);
        }
    }, [origin, fetchProductsByOrigin]);

    const handleSearchChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        // Puedes usar esta función para filtrar productos en el futuro si lo necesitas
    };

    const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDestination(e.target.value);
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const loadData = {
            waggon_uuid: destination,
            place_uuid: origin,
            products: Object.keys(quantities).map((product_uuid) => ({
                product_uuid,
                quantity: quantities[product_uuid],
            })),
            change: parseFloat(cash),
        };
        try {
            await loadWaggon(loadData); 
            // Reset form and states after successful load
            setOrigin('');
            setDestination('');
            setCash('');
            setQuantities({});
            alert('Carga realizada con éxito');
        } catch (error) {
            console.error("Error registrando la carga:", error);
        }
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
                            {warehouses.length > 0 ? (
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
                            ) : (
                                <div>Cargando almacenes...</div>
                            )}
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
                        <section>
                            <ProductGrid products={products} /> 
                        </section>
                        <button type="submit" className="bg-[#58B7A3] text-white rounded-lg py-2 px-4 w-full mt-4">
                            Realizar Carga
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};
