import { useEffect, useState } from 'react';
import { usePageContext } from '../page.context';
import DataTableRow from './data-table-row';

type Props = {
    searchTerm: string;
};

const DataTable = ({ searchTerm }: Props) => {
    const { filteredProducts } = usePageContext();

    useEffect(() => {
        console.log("Filtered Products data:", filteredProducts);
    }, [filteredProducts]);

    // Filtrar los datos en función del término de búsqueda
    const filteredData = filteredProducts.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paso 1: Convertir searchTerm a minúsculas
    const searchTermLower = searchTerm.toLowerCase();

    // Paso 2: Filtrar data
    const filteredProducts = products.filter((item: DataObject) => {
        // Aquí se asume que `item` tiene un campo `name` para simplificar. 
        // Se debe ajustar según la estructura real de DataObject.
        return item.name.toLowerCase().includes(searchTermLower);
    });

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
