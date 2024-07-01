import Image from "next/image";
import { usePageContext } from "./page.context";
import classNames from "classnames";
import { useEffect, useState } from "react";


const PRODUCTS_PER_PAGE = 10; // Ajusta según la cantidad que quieras por página

const ProductGrid: React.FC = () => {

    const { products, openCart } = usePageContext();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
        setTotalPages(totalPages);
    }, [products]);

    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const currentProducts = products.slice(startIndex, endIndex);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <>

            <div className="gap-4 md:gap-y-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 self-center md:self-auto overflow-auto">
                {products.map((product, index) => (
                    <div className={classNames({
                        ' col-span-1 border rounded-2xl border-gray-200 hover:bg-gray-50 p-3': true,
                        'w-full': true
                    })} key={product.id + '_' + index}>
                        <div className=" flex flex-col gap-2 leading-none">
                            <div className=' flex items-center justify-center'>
                                <Image src={product.image} alt='product image' width={24} height={24} className='w-[60px] h-[80px] ' />
                            </div>
                            <div className='font-bold'>{product.name}</div>

                            <div className="flex flex-row gap-2">
                                <span className="">Stock</span>
                                <div className='' typeof="number">{product.stock}</div>
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
export default ProductGrid;