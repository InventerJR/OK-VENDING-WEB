"use client";

import { useEffect } from "react";
import { usePageContext } from "./page.context"

export default function Page() {

    const { createObject } = usePageContext();

    return (
        <main className=" w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
            <div className='md:container'>
                <div className='w-full min-h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>

                    <div className='border-b-[3px] border-b-[#2C3375] w-fit px-4 md:px-12 self-center'>
                        <h1 className='uppercase font-bold text-3xl'>DETALLE DE GANANCIA</h1>
                    </div>

                    <div>
                    </div>
                </div>
            </div>
        </main>
    )
}