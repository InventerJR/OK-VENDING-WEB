"use client";

import { useEffect, useState } from "react";
import { DataObject, usePageContext } from "../page.context";
import { useRouter, useSearchParams } from "next/navigation";
import { APP_ROUTES } from "@/constants";
import Link from "next/link";

export default function Page() {
    const { data } = usePageContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [item, setItem] = useState<DataObject | null>(null);

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            const selectedItem = data.find((item: DataObject) => item.id === parseInt(id, 10));
            if (selectedItem) {
                setItem(selectedItem);
            } else {
                // handle the case where the item is not found
                router.push(APP_ROUTES.ADMIN.PROFIT);
            }
        }
    }, [searchParams, data, router]);

    if (!item) {
        return <div>Loading...</div>;
    }

    return (
        <main className="w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
            <div className='md:container'>
                <div className='w-full min-h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>
                    <div className='border-b-[3px] border-b-[#2C3375] w-fit px-4 md:px-12 self-center'>
                        <h1 className='uppercase font-bold text-3xl'>DETALLE DE GANANCIA</h1>
                    </div>
                    <div>
                        <Link href={APP_ROUTES.ADMIN.PROFIT} className='w-2/3 md:w-[30%]'>
                            <button type='button' className='bg-[#58B7A3] text-white font-semibold px-6 p-2 rounded-md w-full'>
                                Regresar
                            </button>
                        </Link>
                    </div>
                    <div>
                        <h2>Operador:</h2>
                        <p>{item.operator}</p>
                    </div>
                    <div>
                        <h2>Nombre de la maquina:</h2>
                        <p>{item.machine_name}</p>
                    </div>
                    <div>
                        <h2>Ventas según contador:</h2>
                        <p>{item.sale}</p>
                    </div>
                    <div>
                        <h2>Dinero en maquina:</h2>
                        <p>{item.cash_left}</p>
                    </div>
                    <div>
                        <h2>Última Visita:</h2>
                        <p>{item.visit_date}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
