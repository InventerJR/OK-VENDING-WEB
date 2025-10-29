import Image from "next/image";
import { usePurchasesAdminContext } from "../purchases-admin.context";
import DataTableRow from "./data-table-row";
import { useEffect, useState } from "react";

type Props = {
    searchTerm: string;
};

const DataTable = ({ searchTerm }: Props) => {
    const { data, products, currentPage, totalPages, nextUrl, prevUrl, refreshData, isLoading } = usePurchasesAdminContext();

    useEffect(() => {
        console.log("Aqui esta Data:" + products);
    }, [products]);

    // Filtra los datos en función del término de búsqueda
    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcula el índice de inicio y fin de los elementos a mostrar en la página actual
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Filtra los datos para mostrar solo los elementos de la página actual
    const currentData = filteredData.slice(startIndex, endIndex);

    const handlePageChange = (newPage: number) => {
        const url = newPage > currentPage ? nextUrl : prevUrl;
        if (url) {
            refreshData(url);
        }
    };

    return (
        <>
            <table className='w-full'>
                <thead >
                    <tr className='bg-[#2C3375] text-white'>
                        {/* <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Id</th> */}
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Nombre</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Código Postal</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Dirección</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Teléfono</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Almacenista</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'></th>
                    </tr>
                </thead>
                <tbody>
                    { isLoading ? (
                        <tr>
                            <td colSpan={6}>
                                <div className="flex flex-col items-center justify-center py-8">
                                    {/* Loader personalizado */}
                                    <div className="loader border-t-2 border-b-2 border-[#2C3375] rounded-full w-8 h-8 animate-spin mb-4"></div>
                                    <span className="text-center text-gray-700">Cargando...</span>
                                </div>
                            </td>
                        </tr>
                    ) : currentData.map((item, index) => (
                        <DataTableRow
                            key={item.id + '_' + index}
                            index={index}
                            item={item}
                        />
                    ))}
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
    );
};
export default DataTable;
