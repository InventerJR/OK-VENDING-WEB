import Image from "next/image";
import { useSalesAdminContext } from "../sales-admin.context";
import DataTableRow from "./data-table-row";
import { useEffect, useState } from "react";

const DataTable = () => {
    const { data, products } = useSalesAdminContext();

    useEffect(() => {
        console.log("Aqui esta Data:"+products);
    }, []);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de elementos por página

    // Calcula el índice de inicio y fin de los elementos a mostrar en la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Filtra los datos para mostrar solo los elementos de la página actual
    const currentData = data ? data.slice(startIndex, endIndex) : [];

    // Calcula el número total de páginas
    const totalPages = data ? Math.ceil(data.length / itemsPerPage) : 0;

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <table className='w-full'>
                <thead >
                    <tr className='bg-[#2C3375] text-white'>
                        {/* <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Id</th> */}
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Placa</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Ultimo servicio</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Tanque</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Consumo</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Kilometraje</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Dinero</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Vencimiento del Seguro</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'></th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item, index) => (
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