import React, { useEffect, useState } from "react";
import { usePageContext } from "../page.context";
import DataTableRow from "./data-table-row";

type Props = {
    searchTerm: string;
};

const DataTable = ({ searchTerm }: Props) => {
    const { data,currentPageProducts,totalPagesProducts, nextUrlProducts,prevUrlProducts,refreshProductos,setCurrentPageProducts, refreshData} = usePageContext();
    const [localPage, setLocalPage] = useState(1);

    useEffect(() => {
    }, [data]);

    const filteredData = data ? data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    ) : [];

    const handlePageChange = (newPage: number) => {
        if (newPage > localPage && nextUrlProducts) {
            refreshProductos(nextUrlProducts);
            setCurrentPageProducts(newPage);
        } else if (newPage < localPage && prevUrlProducts) {
            refreshProductos(prevUrlProducts);
            setCurrentPageProducts(newPage);
        }
        setLocalPage(newPage);
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
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
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
                        Página {localPage} de {totalPagesProducts}
                    </li>
                    {localPage < totalPagesProducts && (
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