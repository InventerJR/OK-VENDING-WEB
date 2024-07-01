import Image from "next/image";
import classNames from "classnames";
import { useSalesAdminContext } from "./sales-admin.context";
import { useState } from "react";

interface InventoryGridProps {
    searchTerm: string;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({ searchTerm }) => {

    const { products, openCart, closeCart } = useSalesAdminContext();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2); // Número de elementos por página

    // Calcula el índice de inicio y fin de los elementos a mostrar en la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Filtra los datos para mostrar solo los elementos de la página actual
    const currentData = products.slice(startIndex, endIndex);

    // Calcula el número total de páginas
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <>

            <div className="gap-4 gap-y-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 self-center md:self-auto overflow-auto">
                {products.map((product) => (
                    <div className={classNames({
                        ' col-span-1 border rounded-2xl border-gray-200 hover:bg-gray-50 p-3': true,
                        'w-full': true
                    })} key={product.id}>
                        <div className=" flex flex-col gap-2 leading-none">
                            <div className=' flex items-center justify-center'>
                                <Image src={product.image} alt='product image' width={24} height={24} className='w-[60px] h-[80px] ' />
                            </div>
                            <div className='font-bold'>{product.name}</div>

                            <div className="flex flex-row gap-2">
                                <p>Stock </p>
                                {/* quantity */}
                                <div>
                                    <input type="text" value={product.stock} className="rounded-lg border border-gray-400 w-24 text-center w-full" disabled aria-disabled="true"></input>
                                </div>
                            </div>

                            <div className="flex flex-row gap-2">
                                <p>Precio</p>
                                {/* quantity */}
                                <div>
                                    <input type="text" className="rounded-lg border border-gray-400 w-24 text-center w-full" ></input>
                                </div>
                            </div>
                            <div className=" text-center w-full">
                                <button type='button' className='bg-[#58B7A3] text-white text-sm px-6 p-2 rounded-md w-full' onClick={openCart}>
                                    Registrar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Paginación */}
            <div className="flex gap-2 mt-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                    Anterior
                </button>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                    Siguiente
                </button>
            </div>
        </>
    );
};

export default InventoryGrid;
