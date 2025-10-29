import { ITEMS_PER_PAGE, useIncidentPageContext } from "../page.context";
import DataTableRow from "./data-table-row";
import { useState, useEffect } from "react";

interface DataTableProps {
    searchTerm: string;
}

const DataTableIncident: React.FC<DataTableProps> = ({ searchTerm }) => {
    const { data = [], currentPage, totalPages, nextUrl, prevUrl, refreshData, isLoading } = useIncidentPageContext();

    const [localPage, setLocalPage] = useState(1);

    useEffect(() => {
    }, [data]);

    const filteredData = data ? data.filter(item =>
        item.date.toLowerCase().includes(searchTerm.toLowerCase()) 
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
                    ) : filteredData.map((item, index) => (
                        <DataTableRow
                            key={item.id + "_" + index}
                            index={index}
                            item={item}
                        />
                    ))}
                </tbody>
            </table>
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
};

export default DataTableIncident;
