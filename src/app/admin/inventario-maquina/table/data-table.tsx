import { useEffect, useState } from 'react';
import { usePageContext } from '../page.context';
import DataTableRow from './data-table-row';

type Props = {
    searchTerm: string;
};

const DataTable = ({ searchTerm }: Props) => {
    const { filteredProducts, isLoading  } = usePageContext();

    useEffect(() => {
        console.log("Filtered Products data:", filteredProducts);
    }, [filteredProducts]);

    // Filtrar los datos en función del término de búsqueda
    const filteredData = filteredProducts.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <table className='w-full'>
                <thead>
                    <tr className='bg-[#2C3375] text-white'>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Nombre</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Producto</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Categoría</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Precio de compra</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Precio venta</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Stock</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Inversión</th>
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
                                className={`px-3 py-1 rounded-md ${page === currentPage
                                    ? "bg-[#2C3375] text-white hover:bg-blue-600"
                                    : "bg-gray-200 hover:bg-gray-300"
                                    }`}
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

export default DataTable;
