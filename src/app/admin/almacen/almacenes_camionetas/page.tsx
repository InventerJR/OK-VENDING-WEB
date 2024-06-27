"use client";

import { SetStateAction, useEffect, useState } from "react";
import { DataObject, SalesAdminContextProvider, useSalesAdminContext } from './sales-admin.context'
import Image from "next/image";
import DataTable from "./table/data-table";

const Page = () => {

    const { createObject } = useSalesAdminContext();
    const [searchTerm, setSearchTerm] = useState(""); // Paso 2: Crear el estado searchTerm

    // Paso 3: Crear el manejador de eventos para actualizar searchTerm
    const handleSearchChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTerm(event.target.value);
    };

    // Crear una nueva función que llame a createObject con los argumentos necesarios
    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        // Crear un nuevo objeto DataObject
        const dataObject: DataObject = {
            id: 0,
            plate: "",
            last_service_date: "",
            tank: 0,
            consumption: 0,
            kilometers: 0,
            cash: 0,
            insurance_expiration_date: ""
        };

        // Llamar a createObject con el objeto creado
        createObject(dataObject);
    };

    // 
    useEffect(() => {
        console.log('Equipos page loaded');
    }, []);

    return (
        <main className=" w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
            <div className='md:container'>
                <div className='w-full min-h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>

                    <div className='border-b-[3px] border-b-[#2C3375] w-fit px-4 md:px-12 self-center'>
                        <h1 className='uppercase font-bold text-3xl'>Camionetas</h1>
                    </div>

                    <div>
                        <h2 className='font-bold text-xl'>Lista de camionetas</h2>
                        <div>

                            <div className='flex flex-col md:flex-row gap-3 md:items-center'>
                                {/* filters */}
                                <label className='flex flex-col w-[240px]'>
                                    <span className='font-semibold'>Búsqueda de camionetas</span>
                                    <input type='text' className='border border-gray-300 rounded-md h-[30px] p-1' onChange={handleSearchChange}/>
                                </label>
                                <label className='flex flex-col w-[240px]'>

                                </label>
                                <div id="separator" className='hidden md:block md:flex-1 2xl:flex-[0] xl:ml-6 bg-transparent'></div>
                                {/* actions */}
                                {/* add machine */}
                                <button type='button' className='self-start md:self-auto bg-[#58B7A3] rounded-full p-1 min-w-[42px] min-h-[42px] flex items-center justify-center'
                                    onClick={handleButtonClick}>
                                    <Image src='/img/actions/plus.svg' alt='edit icon' width={20} height={20} className='w-[20px] h-[20px]' />
                                </button>
                            </div>

                            <section className='mt-6 overflow-auto'>
                                <DataTable searchTerm={searchTerm}/>
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