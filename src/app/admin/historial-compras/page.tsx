"use client";

import { useEffect, useState } from "react";
import { PurchaseProvider, useContextPurchase } from './page.context';
import Image from "next/image";
import DataTable from "./table/data-table";

const Page = () => {
    const { refreshData } = useContextPurchase();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <PurchaseProvider>
            <main className="w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
                <div className='md:container'>
                    <div className='w-full min-h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>
                        <div className='border-b-[3px] border-b-[#2C3375] w-fit px-4 md:px-12 self-center'>
                            <h1 className='uppercase font-bold text-3xl'>Historial de Compras</h1>
                        </div>
                        <div>
                            <h2 className='font-bold text-xl'>Lista de Compras Realizadas</h2>
                            <div>
                                <div className='flex flex-col md:flex-row gap-3 md:items-center'>
                                    {/* Filtros */}
                                    <label className='flex flex-col w-[240px]'>
                                        <span className='font-semibold'>Búsqueda por Proveedor</span>
                                        <input
                                            type='text'
                                            className='border border-gray-300 rounded-md h-[30px] p-1'
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            placeholder="Buscar proveedor..."
                                        />
                                    </label>
                                </div>
                                <section className='mt-6 overflow-auto'>
                                    <DataTable searchTerm={searchTerm} />
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </PurchaseProvider>
    );
};

export default Page;
