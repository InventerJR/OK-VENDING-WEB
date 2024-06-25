"use client";

import { useEffect, useState } from "react";
import { CategoryProvider, useContextCategory } from './page.context';
import Image from "next/image";
import DataTable from "./table/data-table";

const Page = () => {
    const { createObject } = useContextCategory();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        console.log('Categorías page loaded');
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <CategoryProvider>
            <main className="w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
                <div className='md:container'>
                    <div className='w-full min-h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>
                        <div className='border-b-[3px] border-b-[#2C3375] w-fit px-4 md:px-12 self-center'>
                            <h1 className='uppercase font-bold text-3xl'>Categorías</h1>
                        </div>
                        <div>
                            <h2 className='font-bold text-xl'>Lista de Categorías de Productos</h2>
                            <div>
                                <div className='flex flex-col md:flex-row gap-3 md:items-center'>
                                    {/* Filtros */}
                                    <label className='flex flex-col w-[240px]'>
                                        <span className='font-semibold'>Búsqueda de categoría</span>
                                        <input
                                            type='text'
                                            className='border border-gray-300 rounded-md h-[30px] p-1'
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                        />
                                    </label>
                                    <label className='flex flex-col w-[240px]'>
                                    </label>
                                    <div id="separator" className='hidden md:block md:flex-1 2xl:flex-[0] xl:ml-6 bg-transparent'></div>
                                    {/* Acciones */}
                                    <button type='button' className='self-start md:self-auto bg-[#58B7A3] rounded-full p-1 min-w-[42px] min-h-[42px] flex items-center justify-center'
                                        onClick={(event) => {
                                            // Prevent the default button click behavior
                                            event.preventDefault();

                                            // Call createObject with the correct arguments
                                            createObject({
                                                id: 0,
                                                uuid: 'new-uuid', // Placeholder, replace as needed
                                                name: 'Nueva Categoría',
                                                description: 'Descripción de la nueva categoría' // Placeholder, replace as needed
                                            });
                                        }}>
                                        <Image src='/img/actions/plus.svg' alt='add icon' width={20} height={20} className='w-[20px] h-[20px]' />
                                    </button>
                                </div>
                                <section className='mt-6 overflow-auto'>
                                    <DataTable searchTerm={searchTerm} />
                                    {/* Paginador */}
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </CategoryProvider>
    );
};

export default Page;
