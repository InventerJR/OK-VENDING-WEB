"use client";

import { useEffect, useState } from "react";
import { useIncidentPageContext } from "./page.context"
import Image from "next/image";
import DataTable from "./table/data-table";
import DataTableIncident from "./table/data-table";

const Page = () => {

    const { createObject } = useIncidentPageContext();
    const [searchTermIncident, setSearchTermIncident] = useState("");

    return (
        <main className=" w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
            <div className='md:container'>
                <div className='w-full min-h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>

                    <div className='border-b-[3px] border-b-[#2C3375] w-fit px-4 md:px-12 self-center'>
                        <h1 className='uppercase font-bold text-3xl'>Incidentes</h1>
                    </div>

                    <div>
                        <h2 className='font-bold text-xl'>Lista de Incidentes</h2>
                        <div>

                            <section id="data-filters" className='flex flex-col md:flex-row gap-3 md:items-center'>
                                {/* filters */}
                                <div id="separator" className='hidden md:block md:flex-1 2xl:flex-[0] xl:ml-6 bg-transparent'></div>
                                {/* actions  */}
                                {/* add category */}
                                <button type='button' className='self-start md:self-auto bg-[#58B7A3] rounded-full p-1 min-w-[42px] min-h-[42px] flex items-center justify-center'
                                    onClick={createObject}>
                                    <Image src='/img/actions/plus.svg' alt='edit icon' width={20} height={20} className='w-[20px] h-[20px]' />
                                </button>
                            </section>

                           
                            <section id="data" className='mt-6 overflow-auto'>
                                <DataTableIncident searchTerm={searchTermIncident}/>
                                {/* pager */}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
export default Page;