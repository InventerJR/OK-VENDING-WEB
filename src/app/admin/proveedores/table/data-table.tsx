import Image from "next/image";
import { DataObject, usePageContext } from "../page.context";
import DataTableRow from "./data-table-row";
import { SetStateAction, useState } from "react";

interface DataTableProps {
    searchTerm: string;
}

const DataTable: React.FC<DataTableProps> = ({ searchTerm }) => {
    const { provider, createObject, editObject, deleteObject } = usePageContext();

    // Paso 1: Convertir searchTerm a minúsculas
    const searchTermLower = searchTerm.toLowerCase();

    // Paso 2: Filtrar data
    const filteredProvider = provider.filter((item: DataObject) => {
        // Aquí se asume que `item` tiene un campo `name` para simplificar. 
        // Se debe ajustar según la estructura real de DataObject.
        return item.name.toLowerCase().includes(searchTermLower);
    });

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de elementos por página

    // Calcula el índice de inicio y fin de los elementos a mostrar en la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Filtra los datos para mostrar solo los elementos de la página actual
    const currentData = filteredProvider.slice(startIndex, endIndex);

    // Calcula el número total de páginas
    const totalPages = Math.ceil(filteredProvider.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <table className="w-full">
                <thead>
                    <tr className="bg-[#2C3375] text-white">
                        {/* <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Id</th> */}
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Nombre</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">
                            Proveedor
                        </th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Teléfono</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Correo</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Dirección</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item, index) => (
                        <DataTableRow
                            key={item.id + "_" + index}
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