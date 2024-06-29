import React, { useEffect, useState } from "react";
import { usePageContext } from "../page.context";
import DataTableRow from "./data-table-row";

type Props = {
    searchTerm: string;
};

const DataTable = ({ searchTerm }: Props) => {
    const { data,currentPageProducts,totalPagesProducts, nextUrlProducts,prevUrlProducts,refreshProductos,setCurrentPageProducts} = usePageContext();
    const [itemsPerPage] = useState(10); // Número de elementos por página

    useEffect(() => {
        console.log("Products data in DataTable:", data);
    }, [data]);

    // Filtra los datos en función del término de búsqueda
    const filteredData = data ? data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    // Calcula el índice de inicio y fin de los elementos a mostrar en la página actual
    const startIndex = (currentPageProducts - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Filtra los datos para mostrar solo los elementos de la página actual
    const currentData = filteredData.slice(startIndex, endIndex);
    
    const handlePageChange = (newPage: number) => {
        const url = newPage > currentPageProducts ? nextUrlProducts : prevUrlProducts;
        if (url) {
            refreshProductos(url);
            setCurrentPageProducts(newPage);
        }
    };

    return (
        <>
            <table className='w-full'>
                <thead>
                    <tr className='bg-[#2C3375] text-white'>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Nombre</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Producto</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Marca</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Contenido</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Precio de venta</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'></th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <DataTableRow
                                key={item.id + '_' + index}
                                index={index}
                                item={item}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-4">No products found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Paginación */}
            <div className="mt-4 flex justify-center">
                <ul className="flex gap-2">
                    {/* Botón de página anterior */}
                    {currentPageProducts > 1 && (
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPageProducts - 1)}
                                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Anterior
                            </button>
                        </li>
                    )}
                    {/* Botones de número de página */}
                    {Array.from({ length: totalPagesProducts }, (_, i) => i + 1).map(
                        (page) => (
                            <li key={page}>
                                <button
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded-md ${page === currentPageProducts ? "bg-[#2C3375] text-white hover:bg-blue-600" : "bg-gray-200 hover:bg-gray-300"}`}
                                >
                                    {page}
                                </button>
                            </li>
                        )
                    )}
                    {/* Botón de página siguiente */}
                    {currentPageProducts < totalPagesProducts && (
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPageProducts + 1)}
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
