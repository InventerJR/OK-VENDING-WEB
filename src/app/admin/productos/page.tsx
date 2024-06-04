"use client";

import { useEffect } from "react";
import { usePageContext } from "./page.context"
import Image from "next/image";
import DataTable from "./table/data-table";
import DataTableBrand from "./table/data-table-brand";

const Page = () => {

    const { createObject, createBrandObject } = usePageContext();

    return (
        <main className=" w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
            <div className='md:container'>
                <div className='w-full min-h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>

                    <div className='border-b-[3px] border-b-[#2C3375] w-fit px-4 md:px-12 self-center'>
                        <h1 className='uppercase font-bold text-3xl'>Productos</h1>
                    </div>

                    <div>
                        <h2 className='font-bold text-xl'>Lista de productos</h2>
                        <div>

                            <div className='flex flex-col md:flex-row gap-3  items-start'>
                                {/* filters */}
                                <label className='flex flex-col min-w-[240px]'>
                                    <span className='font-semibold'>Búsqueda de producto por nombre</span>
                                    <input type='text' className='border border-gray-300 rounded-md h-[30px] p-1' />
                                </label>
                                <label className='flex flex-col w-[240px]'>
                                    <span className='font-semibold flex-1'>Clasificación</span>
                                    <select className='border border-gray-300 rounded-md h-[30px]'>
                                        <option value=''>Seleccionar</option>
                                        <option value='admin'>Opt 1</option>
                                        <option value='supervisor'>Opt 2</option>
                                        <option value='operator'>Opt 3</option>
                                    </select>
                                </label>
                                <div id="separator" className='hidden md:block md:flex-1 2xl:flex-[0] xl:ml-6'></div>
                                {/* actions */}
                                {/* add product */}
                                <button type='button' className='self-start md:self-auto bg-[#58B7A3] rounded-full p-1 min-w-[42px] min-h-[42px] flex items-center justify-center'
                                    onClick={createObject}>
                                    <Image src='/img/actions/plus.svg' alt='edit icon' width={20} height={20} className='w-[20px] h-[20px]' />
                                </button>
                            </div>

                            <section className='mt-6 overflow-auto'>
                                <DataTable />
                                {/* pager */}
                            </section>
                            <section className='mt-32 overflow-auto'>
                            <h2 className='font-bold text-xl'>Marcas de tus productos</h2>
                                <div className='flex flex-col md:flex-row gap-3  items-start'>
                                    {/* filters */}
                                    <label className='flex flex-col min-w-[240px]'>
                                        <span className='font-semibold'>Marca</span>
                                        <input type='text' className='border border-gray-300 rounded-md h-[30px] p-1' />
                                    </label>
                                    <label className='flex flex-col w-[240px]'>
                                        <span className='font-semibold flex-1'></span>
                                    </label>
                                    <div id="separator" className='hidden md:block md:flex-1 2xl:flex-[0] xl:ml-6'></div>
                                    {/* actions */}
                                    {/* add product */}
                                    <button type='button' className='self-start md:self-auto bg-[#58B7A3] rounded-full p-1 min-w-[42px] min-h-[42px] flex items-center justify-center'
                                        onClick={createBrandObject}>
                                        <Image src='/img/actions/plus.svg' alt='edit icon' width={20} height={20} className='w-[20px] h-[20px]' />
                                    </button>
                                </div>
                                <br/>
                                <DataTableBrand />
                                {/* pager */}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default Page;