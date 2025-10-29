"use client";

import { useState, SetStateAction, useEffect } from "react";
import { DataObject, usePageContext } from "./page.context";
import Image from "next/image";
import DataTable from "./table/data-table";

const Page = () => {
    const { data, createObject, refreshData, currentType } = usePageContext(); 
    const [activeTab, setActiveTab] = useState("ganancias"); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [filteredData, setFilteredData] = useState<DataObject[]>([]); // Mueve el estado aquí

    // Manejador de eventos para actualizar searchTerm
    const handleSearchChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTerm(event.target.value);
    };

    // Actualiza filteredData cada vez que data cambia
    useEffect(() => {
        if (data && data.length > 0) { 
            const filtered = data.filter((item) => {
                // Filtro para ganancias e incidentes
                return true; 
            });
            setFilteredData(filtered);
        }
    }, [data]); // Mueve el useEffect aquí

    // Función para renderizar el contenido según la pestaña activa
    const renderContent = () => {
        return (
            <>
                {/* Contenido de la pestaña de ganancias */}
                <section id="data-filters" className='flex flex-col md:flex-row gap-3 md:items-center'>
                    {/* filters */}
                    {activeTab === "ganancias" && (
                        <label className='flex flex-col w-[240px]'>
                            <span className='font-semibold'>Búsqueda de ganancia por máquina</span>
                            <input type='text' className='border border-gray-300 rounded-md h-[30px] p-1' onChange={handleSearchChange} />
                        </label>
                    )}
                    {activeTab === "ganancias" && (
                        <label className='flex flex-col w-[240px]'>
                            <span className='font-semibold'>Tipo de máquina</span>
                            <select className='border border-gray-300 rounded-md h-[30px]'>
                                <option value=''>Seleccionar</option>
                                <option value='admin'>Opt 1</option>
                                <option value='supervisor'>Opt 2</option>
                                <option value='operator'>Opt 3</option>
                            </select>
                        </label>
                    )}
                    <div id="separator" className='hidden md:block md:flex-1 2xl:flex-[0] xl:ml-6 bg-transparent'></div>
                    {activeTab === "incidentes" && (
                        <button type='button' className='self-start md:self-auto bg-[#58B7A3] rounded-full p-1 min-w-[42px] min-h-[42px] flex items-center justify-center'
                            onClick={createObject}>
                            <Image src='/img/actions/plus.svg' alt='edit icon' width={20} height={20} className='w-[20px] h-[20px]' />
                        </button>
                    )}
                </section>

                <section id="data" className='mt-6 overflow-auto'>
                    <DataTable data={filteredData} searchTerm={searchTerm} /> {/* Tabla flexible */}
                </section>
            </>
        );
    };

    return (
        <main className="w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
            <div className='md:container'>
                <div className='w-full min-h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>

                    <div className='border-b-[3px] border-b-[#2C3375] w-fit px-4 md:px-12 self-center'>
                        <h1 className='uppercase font-bold text-3xl'>
                            {activeTab === "ganancias" ? "GANANCIAS" : "INCIDENTES"}
                        </h1>
                    </div>

                    {/* Pestañas para cambiar entre "Ganancias" e "Incidentes" */}
                    <div className="flex justify-center mt-4">
                        <button
                            className={`px-4 py-2 ${activeTab === "ganancias" ? "bg-[#2C3375] text-white" : "bg-gray-200"}`}
                            onClick={() => {
                                setActiveTab("ganancias");
                                refreshData(undefined, 'ganancias');
                            }}
                        >
                            Ganancias
                        </button>
                        <button
                            className={`px-4 py-2 ${activeTab === "incidentes" ? "bg-[#2C3375] text-white" : "bg-gray-200"}`}
                            onClick={() => {
                                setActiveTab("incidentes");
                                refreshData(undefined, 'incidentes');
                            }}
                        >
                            Incidentes
                        </button>
                    </div>

                    <div className='mt-6'>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Page;
