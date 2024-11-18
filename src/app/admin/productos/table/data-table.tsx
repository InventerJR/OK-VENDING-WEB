import React, { useEffect, useState } from "react";
import { usePageContext } from "../page.context";
import DataTableRow from "./data-table-row";

type Props = {
    searchTerm: string;
};

const DataTable = ({ searchTerm }: Props) => {
    const { 
        data, 
        allProducts, 
        isLoading, 
        refreshProductos, 
        setCurrentPageProducts, 
        totalPagesProducts,
        nextUrlProducts,
        prevUrlProducts
    } = usePageContext();
    const [localPage, setLocalPage] = useState(1);

    // Filtrar los productos basados en el término de búsqueda
    const filteredData = searchTerm 
        ? allProducts.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : data;

    // Calcular la cantidad de páginas basadas en los datos filtrados
    const ITEMS_PER_PAGE = 5; // Asegúrate de que este valor coincida con ITEMS_PER_PAGE en tu contexto
    const totalPages = searchTerm 
        ? Math.ceil(filteredData.length / ITEMS_PER_PAGE) 
        : totalPagesProducts;

    // Obtener los productos para la página actual
    const paginatedData = searchTerm 
        ? filteredData.slice((localPage - 1) * ITEMS_PER_PAGE, localPage * ITEMS_PER_PAGE)
        : filteredData;

    const handlePageChange = (newPage: number) => {
        if (searchTerm) {
            setLocalPage(newPage);
        } else {
            if (newPage > localPage && nextUrlProducts) {
                refreshProductos(nextUrlProducts);
                setCurrentPageProducts(newPage);
            } else if (newPage < localPage && prevUrlProducts) {
                refreshProductos(prevUrlProducts);
                setCurrentPageProducts(newPage);
            }
            setLocalPage(newPage);
        }
    };

    // Resetear la página local cuando cambia el término de búsqueda
    useEffect(() => {
        setLocalPage(1);
    }, [searchTerm]);

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
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="text-center py-4">Cargando...</td>
                        </tr>
                    ) : paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => (
                            <DataTableRow
                                key={item.id + '_' + index}
                                index={index}
                                item={item}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-4">No se encontraron productos</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Paginación */}
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

export default DataTable;
