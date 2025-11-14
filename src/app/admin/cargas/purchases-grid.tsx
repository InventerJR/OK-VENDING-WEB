import Image from "next/image";
import { usePageContext } from "./page.context";
import classNames from "classnames";

const PRODUCTS_PER_PAGE = 10;

type ProductGridProps = {
    products: any[]; // Idealmente, deberías reemplazar `any` con un tipo más específico que represente tus productos.
};

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    const {
        currentPage,
        totalPages,
        setCurrentPage,
        nextUrl,
        prevUrl,
        fetchProducts,
        origin,
        destination,
        cash,
        quantities,
        setQuantities
    } = usePageContext();

    const handlePageChange = (url: string | null, newPage: number) => {
        if (url) {
            fetchProducts(url);
            setCurrentPage(newPage);
        }
    };

    const handleQuantityChange = (productId: string, quantity: number) => {
        const target = products.find(p => (p.product?.uuid ?? p.uuid) === productId);
        const available = (target?.quantity ?? target?.product?.total_stock ?? target?.total_stock ?? 0) as number;
        if (available >= quantity) {
            setQuantities(prevQuantities => ({
                ...prevQuantities,
                [productId]: quantity
            }));
        }
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
                    })} key={(product.product?.id ?? product.id) + '_' + index}>
                        <div className="flex flex-col gap-2 leading-none">
                            <div className='flex items-center justify-center'>
                                <Image src={(product.product?.image ?? product.image) || '/default-product.png'} alt='product image' width={60} height={80} className='w-[60px] h-[80px]' />
                            </div>
                            <div className='font-bold'>{product.product?.name ?? product.name}</div>
                            <div className="flex flex-row gap-2">
                                <span className="">Stock</span>
                                <div className='' typeof="number">{product.quantity}</div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <p>Cantidad</p>
                                <div>
                                    <input 
                                        type="number" 
                                        value={quantities[(product.product?.uuid ?? product.uuid)] || 0} 
                                        onChange={(e) => handleQuantityChange((product.product?.uuid ?? product.uuid), Number(e.target.value))} 
                                        className="rounded-lg border border-gray-400 w-24 text-center w-full" 
                                        min="0"
                                        max={product.quantity ?? undefined}
                                        disabled={product.quantity === 0}
                                    />
                                </div>
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
