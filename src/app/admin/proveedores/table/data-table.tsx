import Image from "next/image";
import { DataObject, ITEMS_PER_PAGE, usePageContext } from "../page.context";
import DataTableRow from "./data-table-row";
import { SetStateAction, useEffect, useState } from "react";

type Props = {
    searchTerm: string;
};

const DataTable = ({ searchTerm }: Props) => {
    const { allProviders, providers, currentPage, totalPages, nextUrl, prevUrl, refreshData } = usePageContext();

    // Filtrar entre todos los proveedores
    const filteredData = allProviders.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.includes(searchTerm) ||
        item.phone.includes(searchTerm)
    );

    // Obtener la página actual de los resultados filtrados
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (url: string | null) => {
        if (url) refreshData(url);
    };

    return (
        <>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-[#2C3375] text-white">
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left border border-gray-400">Nombre</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left border border-gray-400">Proveedor</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left border border-gray-400">Teléfono</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left border border-gray-400">Correo</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left border border-gray-400">Dirección</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left border border-gray-400">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item, index) => (
                        <DataTableRow key={`${item.id}_${index}`} index={index} item={item} />
                    ))}
                </tbody>
            </table>
            {/* Paginación */}
            <div className="mt-4 flex justify-center">
                <ul className="flex gap-2">
                    {/* Botón de página anterior */}
                    {prevUrl && (
                        <li>
                            <button
                                onClick={() => handlePageChange(prevUrl)}
                                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Anterior
                            </button>
                        </li>
                    )}
                    {/* Información de la página actual */}
                    <li className="px-3 py-1 text-gray-700">Página {currentPage} de {totalPages}</li>
                    {/* Botón de página siguiente */}
                    {nextUrl && (
                        <li>
                            <button
                                onClick={() => handlePageChange(nextUrl)}
                                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Siguiente
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
};

export default DataTable;
