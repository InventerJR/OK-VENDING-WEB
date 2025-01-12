import { DataObject, usePageContext } from "../page.context";
import DataTableRow from "./data-table-row";
import { useEffect, useState } from "react";

interface DataTableProps {
    data: DataObject[];
    searchTerm: string;
    
}

const DataTable: React.FC<DataTableProps> = ({ data, searchTerm}) => {
    const {isLoading} = usePageContext();

    useEffect(() => {
        console.log('Data being rendered:', data);
    }, [data]);

    //const { data } = usePageContext();

    // Paso 1: Convertir searchTerm a minúsculas
    const searchTermLower = searchTerm.toLowerCase();

    // Paso 2: Filtrar data
    const filteredData = data.filter((item: DataObject) => {
        // Ajustar la lógica de búsqueda según la estructura real de DataObject
        const operator = item.operator ? item.operator.toLowerCase() : "";
        const machineName = item.machine_name ? item.machine_name.toLowerCase() : "";
        return operator.includes(searchTermLower) || machineName.includes(searchTermLower);
    });

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Número de elementos por página

    // Calcula el índice de inicio y fin de los elementos a mostrar en la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Filtra los datos para mostrar solo los elementos de la página actual
    //const currentData = data.filter((item) => {
      //  return item.type === currentType;
    //});
    const currentData = filteredData.slice(startIndex, endIndex);

    // Calcula el número total de páginas
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <table className="w-full">
                <thead>
                    <tr className="bg-[#2C3375] text-white">
                        {/* Cabeceras de columna adaptadas a ganancias e incidentes */}
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Fecha/Visita</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Operador/Despachador</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Máquina/Tipo de movimiento</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Venta/Entrada</th>
                        <th className="px-2 py-1 md:px-4 md:py-2 text-left">Efectivo/Salida</th>
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
                    ) : currentData.map((item, index) => (
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
