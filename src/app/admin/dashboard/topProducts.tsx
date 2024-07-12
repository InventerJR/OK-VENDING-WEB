import React, { useState } from 'react';
import { isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';


interface Product {
    id: number;
    name: string;
}

interface ProductSale {
    productId: number;
    machineId: number;
    date: string;
    total: number;
}

interface TopProductsProps {
    products: Product[];
    productSales: ProductSale[];
}

const TopProducts = ({ products, productSales }: TopProductsProps) => {
    const [selectedPeriod, setSelectedPeriod] = useState('Semana');
    // Agrupar las ventas por producto
    const salesByProduct = productSales.reduce((acc, sale) => {
        if (!acc[sale.productId]) {
            acc[sale.productId] = 0;
        }
        acc[sale.productId] += sale.total;
        return acc;
    }, {} as { [key: number]: number });

    const filterProductSalesByPeriod = (productSales: ProductSale[], period: string) => {
        const now = new Date();
        let interval;

        switch (period) {
            case 'Semana':
                interval = { start: startOfWeek(now), end: endOfWeek(now) };
                break;
            case 'Mes':
                interval = { start: startOfMonth(now), end: endOfMonth(now) };
                break;
            case 'Año':
                interval = { start: startOfYear(now), end: endOfYear(now) };
                break;
            default:
                interval = { start: startOfWeek(now), end: endOfWeek(now) };
        }

        return productSales.filter(sale =>
            isWithinInterval(new Date(sale.date), interval)
        );
    };

    // Crear un arreglo de productos con sus ventas totales
    const productsWithSales = products.map(product => ({
        ...product,
        totalSold: salesByProduct[product.id] || 0
    }));

    // Ordenar productos por total vendido
    const sortedProducts = productsWithSales.sort((a, b) => b.totalSold - a.totalSold);

    return (
        <div>
            <h2>Productos Más Vendidos</h2>
            <div className="flex flex-col gap-2">
                <label htmlFor="periodSelect" className="font-bold text-sm">Filtro de Periodo:</label>
                <select
                    id="periodSelect"
                    className="w-[300px] border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                    <option value="Semana">Semana</option>
                    <option value="Mes">Mes</option>
                    <option value="Año">Año</option>
                </select>
            </div>
            <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total Vendido
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedProducts.map((product) => (
                        <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.totalSold}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TopProducts;
