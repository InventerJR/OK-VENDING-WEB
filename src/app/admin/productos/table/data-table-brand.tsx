import React, { useEffect, useState } from "react";
import { usePageContext } from "../page.context";
import BrandTableRow from "./data-table-row-brand";

type Props = {
    searchTerm: string;
};

const DataTableBrand = ({ searchTerm }: Props) => {
    const { brands, currentPageBrands, totalPagesBrands, nextUrlBrands, prevUrlBrands, refreshData, setCurrentPageBrands } = usePageContext();
    const [itemsPerPage] = useState(5); // Número de elementos por página

    useEffect(() => {
        console.log("Brands data in DataTableBrand:", brands);
    }, [brands]);

    // Filtra los datos en función del término de búsqueda
    const filteredData = brands ? brands.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    // Calcula el índice de inicio y fin de los elementos a mostrar en la página actual
    const startIndex = (currentPageBrands - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Filtra los datos para mostrar solo los elementos de la página actual
    const currentData = filteredData.slice(startIndex, endIndex);

    // Calcula el número total de páginas basado en los datos filtrados
    const totalPagesFiltered = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        const url = newPage > currentPageBrands ? nextUrlBrands : prevUrlBrands;
        if (url) {
            refreshData(url);
            setCurrentPageBrands(newPage);
        } else {
            setCurrentPageBrands(newPage);
        }
    };

    return (
        <>
            <table className='w-full'>
                <thead>
                    <tr className='bg-[#2C3375] text-white'>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Marca</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'></th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.length > 0 ? (
                        currentData.map((item, index) => (
                            <BrandTableRow
                                key={item.id + '_' + index}
                                index={index}
                                item={item}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={2} className="text-center py-4">No brands found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Paginación */}
            <div className="mt-4 flex justify-center">
                <ul className="flex gap-2">
                    {/* Botón de página anterior */}
                    {currentPageBrands > 1 && (
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPageBrands - 1)}
                                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                Anterior
                            </button>
                        </li>
                    )}
                    {/* Botones de número de página */}
                    {Array.from({ length: totalPagesFiltered }, (_, i) => i + 1).map(
                        (page) => (
                            <li key={page}>
                                <button
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded-md ${page === currentPageBrands
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
                    {currentPageBrands < totalPagesFiltered && (
                        <li>
                            <button
                                onClick={() => handlePageChange(currentPageBrands + 1)}
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

export default DataTableBrand;