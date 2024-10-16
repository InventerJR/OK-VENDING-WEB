import Image from "next/image";
import { usePageContext } from "../page.context";
import DataTableRow from "./data-table-row";
import { useEffect, useState } from "react";

export default function DataTable({ searchTerm }: { searchTerm: string }) {
    const { data, currentPage, totalPages: totalPages, nextUrl, prevUrl, refreshData, setCurrentPage } = usePageContext();
    const [localPage, setLocalPage] = useState(1);

    useEffect(() => {
    }, [data]);

    const filteredData = data ? data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handlePageChange = (newPage: number) => {
        if (newPage > localPage && nextUrl) {
            refreshData(nextUrl);
        } else if (newPage < localPage && prevUrl) {
            refreshData(prevUrl);
        }
        setLocalPage(newPage);
    };
    return (
        <>
            <table className='w-full'>
                <thead>
                    <tr className='bg-[#2C3375] text-white'>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Nombre</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Tipo</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Dirección</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item, index) =>
                        <DataTableRow
                            key={item.uuid + '_' + index}
                            index={index}
                            item={item}
                        />
                    )}
                </tbody>
            </table>
            {/* Paginación */}
            <div className="mt-4 flex justify-center items-center gap-4">
                <ul className="flex gap-2">
                    {localPage > 1 && (
                        <li>
                            <button
                                onClick={() => handlePageChange(localPage - 1)}
                                className="px-3 py-1 rounded-md bg-[#2C3375] hover:bg-[#2C3390] text-white"
                            >
                                Anterior
                            </button>
                        </li>
                    )}
                    <li className="px-3 py-1 text-gray-700">
                        Página {localPage} de {totalPages}
                    </li>
                    {localPage < totalPages && (
                        <li>
                            <button
                                onClick={() => handlePageChange(localPage + 1)}
                                className="px-3 py-1 rounded-md bg-[#2C3375] hover:bg-[#2C3390] text-white"
                            >
                                Siguiente
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
}
