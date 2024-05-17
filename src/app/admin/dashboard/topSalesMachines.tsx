// Importar los componentos necesarios de React y otras bibliotecas
import React from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';

// Crear el componente TopSalesMachine
interface Sale {
    machineId: string;
    date: string;
    sales: number;
  }
  
  interface TopSalesMachineProps {
    salesData: Sale[];
    selectedMachine: string;
    period: string;
    machines: Machine[];
  }
  interface Machine {
    id: string;
    name: string;
    // Añade aquí cualquier otra propiedad que necesites
  }

  
export function TopSalesMachine({ salesData, selectedMachine, period }: TopSalesMachineProps) {
  // Filtrar los datos de las ventas basándonos en la máquina y el periodo seleccionados
  const filteredSalesData = salesData.filter(sale => sale.machineId === selectedMachine && (
    (period === 'Semana' && isWithinInterval(new Date(sale.date), { start: startOfWeek(new Date()), end: endOfWeek(new Date()) })) ||
    (period === 'Mes' && isWithinInterval(new Date(sale.date), { start: startOfMonth(new Date()), end: endOfMonth(new Date()) })) ||
    (period === 'Año' && isWithinInterval(new Date(sale.date), { start: startOfYear(new Date()), end: endOfYear(new Date()) }))
  ));

  // Ordenar los datos filtrados por ventas en orden descendente
  const sortedSalesData = filteredSalesData.sort((a, b) => b.sales - a.sales);

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
                        >
                            <option value="admin">Semana</option>
                            <option value="user">Mes</option>
                            <option value="user">Año</option>
                        </select>
                    </div>
      <table>
        <thead>
          <tr>
            <th>Nombre de la máquina</th>
            <th>Monto vendido</th>
          </tr>
        </thead>
        <tbody>
          {sortedSalesData.map(sale => (
            <tr key={sale.machineId}>
              <td>{machines.find(machine => machine.id === sale.machineId).name}</td>
              <td>{sale.sales}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}