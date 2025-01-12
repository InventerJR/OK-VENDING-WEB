import Image from "next/image";
import { DataObject, ITEMS_PER_PAGE, usePageContext } from "../page.context";
import DataTableRow from "./data-table-row";
import { SetStateAction, useEffect, useState } from "react";

type Props = {
    searchTerm: string;
};

const DataTable = ({ searchTerm }: Props) => {
    const { allProviders, providers, currentPage, totalPages, nextUrl, prevUrl, refreshData, isLoading } = usePageContext();

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
                    {isLoading ? (
                        <tr>
                            <td colSpan={6}>
                                <div className="flex flex-col items-center justify-center py-8">
                                    {/* Loader personalizado */}
                                    <div className="loader border-t-2 border-b-2 border-[#2C3375] rounded-full w-8 h-8 animate-spin mb-4"></div>
                                    <span className="text-center text-gray-700">Cargando...</span>
                                </div>
                            </td>
                        </tr>
                    ) : currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <DataTableRow key={`${item.id}_${index}`} index={index} item={item} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-4">No se encontraron resultados</td>
                        </tr>
                    )}
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
