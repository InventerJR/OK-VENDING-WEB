import Image from "next/image";
import { DataObject, usePageContext } from "../page.context";
import DataTableRow from "./data-table-row";
import { useState } from "react";


export default function DataTable() {

    const { data, createObject, editObject, deleteObject } = usePageContext();

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de elementos por página

    // Calcula el índice de inicio y fin de los elementos a mostrar en la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Filtra los datos para mostrar solo los elementos de la página actual
    const currentData = data.slice(startIndex, endIndex);

    // Calcula el número total de páginas
    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <table className='w-full'>
                <thead >
                    <tr className='bg-[#2C3375] text-white'>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Operador</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Máquina</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Captura</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Venta</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Dinero</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Fecha de visita</th>
                        {/* <th className='px-2 py-1 md:px-4 md:py-2 text-left'></th> */}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item, index) =>
                        <DataTableRow
                            key={item.id + '_' + index}
                            index={index}
                            item={item}
                        />
                    )}
                </tbody>
            </table>
            {/* Paginación */}
            <div className="mt-4 flex justify-center">
                <ul className="flex gap-2">
                    {/* Botón de página anterior */}
                    {currentPage > 1 && (
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Anterior
                            </button>
                        </li>
                    )}
                    {/* Botones de número de página */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                            <li key={page}>
                                <button
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded-md ${page === currentPage
                                        ? "bg-[#2C3375] text-white hover:bg-blue-600"
                                        : "bg-gray-200 hover:bg-gray-300"
                                        }`}
                                >
                                    {page}
                                </button>
                            </li>
                        )
                    )}
                    {/* Botón de página siguiente */}
                    {currentPage < totalPages && (
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Siguiente
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </>
    )
}