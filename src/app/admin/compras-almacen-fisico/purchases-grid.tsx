import Image from "next/image";
import { StockDataObject, usePageContext } from "./page.context";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { localStorageWrapper } from '@/utils/localStorageWrapper';

type ProductGridProps = {
    searchTerm: string;
    selectedCategory: string;
    selectedSupplier: string;
    
};

const ProductGrid: React.FC<ProductGridProps> = ({ searchTerm, selectedCategory, selectedSupplier }) => {
    const { products, openCart, currentPage, totalPages, setCurrentPage, nextUrl, prevUrl, fetchProducts, updateProduct } = usePageContext();
    const [filteredProducts, setFilteredProducts] = useState(products);

    useEffect(() => {
        let filtered = products;
        if (searchTerm) {
            filtered = filtered.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (selectedCategory) {
            filtered = filtered.filter(product => product.clasification === selectedCategory);
        }
        if (selectedSupplier) {
            filtered = filtered.filter(product => product.provider === selectedSupplier);
        }
        setFilteredProducts(filtered);
    }, [searchTerm, selectedCategory, selectedSupplier, products]);

    const handlePageChange = (url: string | null, newPage: number) => {
        if (url) {
            fetchProducts(url);
            setCurrentPage(newPage);
        }
    };

    const handleChange = (index: number, field: keyof StockDataObject) => (event: React.ChangeEvent<HTMLInputElement>) => {
        updateProduct(index, field, event.target.value);
    };

    {/*const handleRegister = (product: any) => {
        let registeredProducts = JSON.parse(localStorageWrapper.getItem('registeredProducts') ?? '[]');
        const existingProduct = registeredProducts.find((p: any) => p.uuid === product.uuid);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            registeredProducts.push({ uuid: product.uuid, name: product.name, image: product.image, quantity: 1 });
        }
        localStorageWrapper.setItem('registeredProducts', JSON.stringify(registeredProducts));
        openCart();
    };*/}

    return (
        <>
            <div className="gap-4 md:gap-y-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 self-center md:self-auto overflow-auto">
                {filteredProducts.map((product, index) => (
                    <div className={classNames({
                        'col-span-1 border rounded-2xl border-gray-200 hover:bg-gray-50 p-3': true,
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
                                <span className="">Precio de venta: </span>
                                <div className='' typeof="number">${product.sale_price}</div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="">Cantidad a comprar: </span>
                                <input
                                    type="number"
                                    className="rounded-lg border border-gray-400 w-24"
                                    value={product.quantity || ''}
                                    onChange={handleChange(index, 'quantity')}
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="">Cantidad por paquete: </span>
                                <input
                                    type="number"
                                    className="rounded-lg border border-gray-400 w-24"
                                    value={product.package_quantity || ''}
                                    onChange={handleChange(index, 'package_quantity')}
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="">Fecha de expiración: </span>
                                <input
                                    type="date"
                                    className="rounded-lg border border-gray-400 w-24"
                                    value={product.expiration || ''}
                                    onChange={handleChange(index, 'expiration')}
                                />
                            </div>
                            <div className="flex flex-row gap-2">
                                <span className="">Precio de compra: </span>
                                <input
                                    type="number"
                                    className="rounded-lg border border-gray-400 w-24"
                                    value={product.purchase_price || ''}
                                    onChange={handleChange(index, 'purchase_price')}
                                />
                            </div>
                            {/*<div className="text-center w-full">
                                <button
                                    type='button'
                                    className='bg-[#58B7A3] text-white text-sm px-6 p-2 rounded-md w-full'
                                    onClick={() => handleRegister(product)}
                                >
                                    Registrar
                                </button>
                            </div>*/}
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
