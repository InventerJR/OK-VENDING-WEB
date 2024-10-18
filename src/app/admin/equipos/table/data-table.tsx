import { usePageContext } from "../page.context";
import DataTableRow from "./data-table-row";

export default function DataTable({ searchTerm }: { searchTerm: string }) {
    const { 
        data, 
        currentPage, 
        totalPages, 
        setCurrentPage,
        isLoading
    } = usePageContext();

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (isLoading) {
        return <div className="w-full text-center py-4">Cargando...</div>;
    }

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
                    {data.map((item, index) => (
                        <DataTableRow
                            key={item.uuid + '_' + index}
                            index={index}
                            item={item}
                        />
                    ))}
                </tbody>
            </table>
            {/* Paginación */}
            <div className="mt-4 flex justify-center items-center gap-4">
                <ul className="flex gap-2">
                    {currentPage > 1 && (
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                className="px-3 py-1 rounded-md bg-[#2C3375] hover:bg-[#2C3390] text-white"
                            >
                                Anterior
                            </button>
                        </li>
                    )}
                    <li className="px-3 py-1 text-gray-700">
                        Página {currentPage} de {totalPages}
                    </li>
                    {currentPage < totalPages && (
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
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