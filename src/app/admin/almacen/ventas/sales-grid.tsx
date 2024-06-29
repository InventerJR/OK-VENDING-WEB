import Image from "next/image";
import classNames from "classnames";
import { useSalesAdminContext } from "./sales-admin.context";
import { useState, useEffect } from "react";

export default function InventoryGrid() {
    const { products, searchTerm, setSearchTerm, currentPage, totalPages, nextUrl, prevUrl, refreshProducts, setCurrentPage } = useSalesAdminContext();
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        refreshProducts();
    }, [currentPage, refreshProducts]);

    const handlePageChange = (newPage: number) => {
        const url = newPage > currentPage ? nextUrl : prevUrl;
        if (url) {
            refreshProducts(url);
            setCurrentPage(newPage);
        }
    };

    const handleSearchChange = (event: { target: { value: string; }; }) => {
        setSearchTerm(event.target.value);
        refreshProducts(undefined, event.target.value);
    };

    // Filtra los productos según el término de búsqueda
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className='flex flex-row gap-3 items-center flex-wrap'>
                <label className='flex flex-col w-[240px]'>
                    <span className='font-semibold'>Búsqueda de producto</span>
                    <input type='text' className='border border-gray-300 rounded-md h-[30px] p-1' value={searchTerm} onChange={handleSearchChange} />
                </label>
                {/* Clasificación y otros filtros aquí */}
            </div>

            <div className="gap-4 gap-y-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 self-center md:self-auto overflow-auto">
                {filteredProducts.map((product) => (
                    <div className={classNames({
                        'col-span-1 border rounded-2xl border-gray-200 hover:bg-gray-50 p-3': true,
                        'w-full': true
                    })} key={product.id}>
                        <div className="flex flex-col gap-2 leading-none">
                            <div className='flex items-center justify-center'>
                                <Image src={product.image} alt='product image' width={24} height={24} className='w-[60px] h-[80px]' />
                            </div>
                            <div className='font-bold'>{product.name}</div>
                            <div className="flex flex-row gap-2">
                                <p>Stock</p>
                                <div>
                                    <input type="text" value={product.stock} className="rounded-lg border border-gray-400 w-24 text-center w-full" disabled />
                                </div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p>Precio</p>
                                <div>
                                    <input type="text" className="rounded-lg border border-gray-400 w-24 text-center w-full" />
                                </div>
                            </div>
                            <div className="text-center w-full">
                                <button type='button' className='bg-[#58B7A3] text-white text-sm px-6 p-2 rounded-md w-full'>
                                    Registrar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            <div className="mt-4 flex justify-center">
                <ul className="flex gap-2">
                    {currentPage > 1 && (
                        <li>
                            <button onClick={() => handlePageChange(currentPage - 1)} className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300">
                                Anterior
                            </button>
                        </li>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li key={page}>
                            <button onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded-md ${page === currentPage ? "bg-[#2C3375] text-white hover:bg-blue-600" : "bg-gray-200 hover:bg-gray-300"}`}>
                                {page}
                            </button>
                        </li>
                    ))}
                    {currentPage < totalPages && (
                        <li>
                            <button onClick={() => handlePageChange(currentPage + 1)} className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300">
                                Siguiente
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </>
    )
}
