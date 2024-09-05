import { ITEMS_PER_PAGE, useIncidentPageContext } from "../page.context";
import DataTableRow from "./data-table-row";
import { useState, useEffect } from "react";

interface DataTableProps {
    searchTerm: string;
}

const DataTableIncident: React.FC<DataTableProps> = ({ searchTerm }) => {
    const { data = [], currentPage, totalPages, nextUrl, prevUrl, refreshData } = useIncidentPageContext();

    const [itemsPerPage] = useState(ITEMS_PER_PAGE);

    useEffect(() => {
        console.log('Data being rendered:', data);  // Verifica el contenido de `data`
    }, [data]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentData = data.slice(startIndex, endIndex);

    if (currentData.length === 0) {
        return <p>No hay datos para mostrar.</p>;
    }

    const handlePageChange = (newPage: number) => {
        const url = newPage > currentPage ? nextUrl : prevUrl;
        if (url) {
            refreshData(url);
        }
    };

    
    

    return (
        <>
            <table className="w-full">
                <thead>
                    <tr className="bg-[#2C3375] text-white">
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Fecha</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Despachador(a)</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Tipo de movimiento</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Monto de entrada</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Monto de salida</th>
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
            <div className="mt-4 flex justify-center">
                <ul className="flex gap-2">
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li key={page}>
                            <button
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded-md ${page === currentPage ? "bg-[#2C3375] text-white hover:bg-blue-600" : "bg-gray-200 hover:bg-gray-300"}`}
                            >
                                {page}
                            </button>
                        </li>
                    ))}
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

export default DataTableIncident;
