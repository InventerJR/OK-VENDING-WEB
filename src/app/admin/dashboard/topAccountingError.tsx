// Importar los componentes necesarios de React y otras bibliotecas
import React, { useState } from 'react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from "date-fns";

// Crear el componente TopSalesMachine
interface Sale {
    machineId: number;
    date: string;
    sales: number;
    errorMargin: number; // Agrega la propiedad errorMargin
}

interface TopAccountingErrorProps {
    salesData: Sale[];
    selectedMachine: number;
    period: string;
    machines: Machine[];
}
interface Machine {
    id: number;
    name: string;
    // Añade aquí cualquier otra propiedad que necesites
}

const machines: Machine[] = [
    { id: 1, name: "Máquina 1" },
    { id: 2, name: "Máquina 2" },
    { id: 3, name: "Máquina 3" },
    { id: 4, name: "Máquina 4" },
    { id: 5, name: "Máquina 5" },
    { id: 6, name: "Máquina 6" },
];


export function TopAccountingError({ salesData, selectedMachine, machines }: TopAccountingErrorProps) {
    //Estado para el Select
    const [selectedPeriod, setSelectedPeriod] = useState('Semana')
    // Función para filtrar los datos de ventas 
    const filterSalesDataByPeriod = (salesData: Sale[], selectedPeriod: string) => {
        const result = salesData.filter(sale => (
            (selectedPeriod === 'Semana' && isWithinInterval(new Date(sale.date), { start: startOfWeek(new Date()), end: endOfWeek(new Date()) })) ||
            (selectedPeriod === 'Mes' && isWithinInterval(new Date(sale.date), { start: startOfMonth(new Date()), end: endOfMonth(new Date()) })) ||
            (selectedPeriod === 'Año' && isWithinInterval(new Date(sale.date), { start: startOfYear(new Date()), end: endOfYear(new Date()) }))
        ));
        console.log('Filtered Sales Data:', result);
        return result;
    }

    // Filtrar los datos de las ventas basándonos en la máquina y el periodo seleccionados
    const filteredSalesData = filterSalesDataByPeriod(salesData, selectedPeriod);

    // Agrupar los márgenes de error por máquina
    const errorMarginByMachine = filteredSalesData.reduce((acc, sale) => {
        const machine = machines.find(m => m.id === sale.machineId);
        if (machine) {
            if (!acc[machine.id]) {
                acc[machine.id] = { totalErrorMargin: 0, saleCount: 0 };
            }
            acc[machine.id].totalErrorMargin += sale.errorMargin;
            acc[machine.id].saleCount++;
        }
        return acc;
    }, {} as { [machineId: number]: { totalErrorMargin: number, saleCount: number } });

    // Calcular el promedio de error por máquina
    const averageErrorMarginByMachine = Object.entries(errorMarginByMachine).map(([machineId, data]) => {
        const averageErrorMargin = data.saleCount > 0 ? data.totalErrorMargin / data.saleCount : 0;
        return [parseInt(machineId), averageErrorMargin];
    });

    // Ordenar los promedios de error por máquina en orden descendente
    const sortedErrorMarginByMachine = averageErrorMarginByMachine.sort((a, b) => b[1] - a[1]);

    // Filtrar las máquinas con el promedio de error más alto (por ejemplo, las 3 primeras)
    const topErrorMachines = sortedErrorMarginByMachine.slice(0, 3); // Puedes cambiar el número 3 para mostrar más o menos máquinas

    // Renderizar la tabla
    return (
        <div>
            <h2>Lista de máquinas con más margen de error</h2>
            {/* select */}
            <div className="flex flex-col gap-2">
                <label htmlFor="type" className="font-bold text-sm">Filtro de fecha</label>
                <select
                    id="type"
                    className="w-[300px] border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                    <option value="Semana">Semana</option>
                    <option value="Mes">Mes</option>
                    <option value="Año">Año</option>
                </select>
                <br />
            </div>
            <table className="w-full">
                <thead>
                    <tr className='bg-[#2C3375] text-white'>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Nombre de la máquina</th>
                        <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Diferencia</th>
                    </tr>
                </thead>
                <tbody>
                    {machines.map(machine => {
                        const saleCount = errorMarginByMachine[machine.id]?.saleCount || 120;
                        return (
                            <tr key={machine.id} className='px-2 py-1 md:px-4 md:py-2'>
                                <td className='px-2 py-1 md:px-4 md:py-2'>{machine.name}</td>
                                <td className='px-2 py-1 md:px-4 md:py-2'>{saleCount}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}