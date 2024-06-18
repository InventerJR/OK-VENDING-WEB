// Importar los componentes necesarios de React y otras bibliotecas
import React, { useState } from 'react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from "date-fns";

// Crear el componente TopSalesMachine
interface Sale {
  machineId: number;
  date: string;
  sales: number;
}

interface TopSalesMachineProps {
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

const salesG: Sale[] = [
  { machineId: 1, date: "2023-10-26", sales: 120 },
]


export function TopSalesMachine({ salesData, selectedMachine, machines }: TopSalesMachineProps) {
  //Estado para el Select
  const [selectedPeriod, setSelectedPeriod] = useState('Semana')
  // Función para filtrar los datos de ventas 
  const filterSalesDataByPeriod = (salesData: Sale[], selectedPeriod: string) => {
    return salesData.filter(sale => (
      (selectedPeriod === 'Semana' && isWithinInterval(new Date(sale.date), { start: startOfWeek(new Date()), end: endOfWeek(new Date()) })) ||
      (selectedPeriod === 'Mes' && isWithinInterval(new Date(sale.date), { start: startOfMonth(new Date()), end: endOfMonth(new Date()) })) ||
      (selectedPeriod === 'Año' && isWithinInterval(new Date(sale.date), { start: startOfYear(new Date()), end: endOfYear(new Date()) }))
    ));
  }

  // Filtrar los datos de las ventas basándonos en la máquina y el periodo seleccionados
  const filteredSalesData = filterSalesDataByPeriod(salesData, selectedPeriod);

  // Agrupar las ventas por máquina
  const salesByMachine = filteredSalesData.reduce((acc, sale) => {
    const machine = machines.find(m => m.id === sale.machineId);
    if (machine) {
      acc[machine.id] = (acc[machine.id] || 0) + sale.sales;
    }
    return acc;
  }, {} as { [machineId: number]: number });

  // Renderizar la tabla
  return (
    <div>
      <h2>Lista de máquinas con más ventas</h2>
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
        <br/>
      </div>
      <table className="w-full">
        <thead>
          <tr className='bg-[#2C3375] text-white'>
            <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Nombre de la máquina</th>
            <th className='px-2 py-1 md:px-4 md:py-2 text-left'>Monto vendido</th>
          </tr>
        </thead>
        <tbody>
          {/* Mostrar todas las máquinas con sus ventas */}
          {machines.map(machine => {
            const sales = salesByMachine[machine.id] || 160; 
            return (
              <tr key={machine.id} className='px-2 py-1 md:px-4 md:py-2'>
                <td className='px-2 py-1 md:px-4 md:py-2'>{machine.name}</td>
                <td className='px-2 py-1 md:px-4 md:py-2'>{sales}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}