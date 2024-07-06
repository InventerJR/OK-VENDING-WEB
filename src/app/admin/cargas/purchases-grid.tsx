import Image from "next/image";
import { usePageContext } from "./page.context";
import classNames from "classnames";
import { useEffect, useState } from "react";

const PRODUCTS_PER_PAGE = 10;

type ProductGridProps = {
    products: any[]; // Idealmente, deberías reemplazar `any` con un tipo más específico que represente tus productos.
};

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    const { openCart, currentPage, totalPages, setCurrentPage, nextUrl, prevUrl, fetchProducts, origin, destination, cash, fetchProductsByOrigin } = usePageContext();
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    useEffect(() => {
        // Si un origen está seleccionado, buscar los productos para ese origen
        if (origin) {
            fetchProductsByOrigin(origin);
        }
    }, [origin]);

    const handlePageChange = (url: string | null, newPage: number) => {
        if (url) {
            fetchProducts(url);
            setCurrentPage(newPage);
        }
    };

    const handleRegister = (product: { id?: number; name: any; image?: string; purchase_price?: number; sale_price?: number; stock?: number; total_stock?: number; investment?: number; clasification?: string; provider?: string; uuid?: any; }) => {
        // Obtener el arreglo actual del local storage
        let registeredProducts = JSON.parse(localStorage.getItem('registeredProducts') ?? '[]');

        // Verificar si el producto ya está en el arreglo
        const existingProduct = registeredProducts.find((p: any) => p.uuid === product.uuid);

        if (existingProduct) {
            // Si el producto ya existe, incrementar la cantidad
            existingProduct.quantity += 1;
        } else {
            // Si el producto no existe, agregarlo con cantidad 1
            registeredProducts.push({ uuid: product.uuid, name: product.name, image: product.image, quantity: 1 });
        }

        // Guardar el arreglo actualizado en el local storage
        localStorage.setItem('registeredProducts', JSON.stringify(registeredProducts));

        // Abrir el carrito y setear el producto seleccionado
        setSelectedProduct(product);
        openCart();
    };

    if (!origin) {
        return <div>Selecciona un almacén para ver los productos.</div>;
    }

    return (
        <>
            <div className="gap-4 md:gap-y-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 self-center md:self-auto overflow-auto">
                {products.map((product, index) => (
                    <div className={classNames({
                        ' col-span-1 border rounded-2xl border-gray-200 hover:bg-gray-50 p-3': true,
                        'w-full': true
                    })} key={product.id + '_' + index}>
                        <div className="flex flex-col gap-2 leading-none">
                            <div className='flex items-center justify-center'>
                                <Image src={product.image || '/default-product.png'} alt='product image' width={60} height={80} className='w-[60px] h-[80px]' />
                            </div>
                            <div className='font-bold'>{product.name}</div>
                            <div className="flex flex-row gap-2">
                                <span className="">Stock</span>
                                <div className='' typeof="number">{product.total_stock}</div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="">Precio: </span>
                                <div className='' typeof="number">${product.sale_price}</div>
                            </div>
                            <div className="text-center w-full">
                                <button
                                    type='button'
                                    className='bg-[#58B7A3] text-white text-sm px-6 p-2 rounded-md w-full'
                                    onClick={() => handleRegister(product)}
                                >
                                    Registrar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex gap-2 mt-4">
                <button
                    disabled={!prevUrl}
                    onClick={() => handlePageChange(prevUrl, currentPage - 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                    Anterior
                </button>
                <button
                    disabled={!nextUrl}
                    onClick={() => handlePageChange(nextUrl, currentPage + 1)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                    Siguiente
                </button>
            </div>
        </>
    );
};

export default ProductGrid;
