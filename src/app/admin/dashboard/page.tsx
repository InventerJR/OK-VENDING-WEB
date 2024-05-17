'use client'
import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic'
const ReactEcharts = dynamic(() => import('echarts-for-react'), { ssr: false },)
import { ComposeOption } from 'echarts/core';
import { BarSeriesOption, LineSeriesOption } from 'echarts/charts';
import { useAppContext } from "@/hooks/useAppContext";
import { TopSalesMachine } from './topSalesMachines';
// Datos de ejemplo (Reemplaza con tu API o base de datos)
const machines = [
  { id: 1, name: "Máquina 1" },
  { id: 2, name: "Máquina 2" },
  { id: 3, name: "Máquina 3" }
];

const salesData = [
  { machineId: 1, date: "2023-10-26", sales: 120 },
  { machineId: 2, date: "2023-10-26", sales: 200 },
  { machineId: 3, date: "2023-10-26", sales: 150 },
  // ... más datos de ventas por máquina y fecha
];

const errorData = [
  { machineId: 1, date: "2023-10-26", difference: 10 },
  { machineId: 2, date: "2023-10-26", difference: 25 },
  { machineId: 3, date: "2023-10-26", difference: 5 },
  // ... más datos de errores por máquina y fecha
];

const products = [
  { id: 1, name: "Producto 1" },
  { id: 2, name: "Producto 2" },
  { id: 3, name: "Producto 3" }
];

const productSales = [
  { productId: 1, machineId: 1, date: "2023-10-26", total: 50 },
  { productId: 2, machineId: 2, date: "2023-10-26", total: 120 },
  { productId: 3, machineId: 3, date: "2023-10-26", total: 80 },
  // ... más datos de ventas de productos por máquina y fecha
];

// Opciones de Echarts
type ECOption = ComposeOption<BarSeriesOption | LineSeriesOption>;

const option_bars: ECOption = {
  radius: "100%", // this
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
};

const option_line: ECOption = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'line'
    }
  ]
};



// Componente Dashboard principal
export default function AdminPage() {
  const { setLoading } = useAppContext();
  const [showChart, setShowChart] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(1);
  const [period, setPeriod] = useState("Semana");

  // Lógica para manejar cambios de filtro
  const handleMachineChange = (event) => {
    setSelectedMachine(parseInt(event.target.value, 10)); // Convierte el valor a número
  };

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  useEffect(() => {
    setShowChart(true);
  }, []);

  return (
    <main className="w-full py-12 px-4 md:px-12 h-full">
      <div className='md:container'>
        <div className='w-full h-fit px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>
          <div className="h-full w-full flex flex-col overflow-auto gap-6">
            <div className='border-b-[3px] border-b-[#2C3375] w-fit px-12 self-center'>
              <h1 className='uppercase font-bold text-3xl'>DASHBOARD</h1>
            </div>
            <div>
              {/* Filtros */}
              <div className="flex gap-4 mb-4">
                <div>
                  <label htmlFor="periodSelect" className="block text-sm font-medium text-gray-700">Periodo:</label>
                  <select
                    id="periodSelect"
                    value={period}
                    onChange={handlePeriodChange}
                    className="w-[300px] h-[40px] border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                  >
                    <option value="Semana">Semana</option>
                    <option value="Mes">Mes</option>
                    <option value="Año">Año</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="machineSelect" className="block text-sm font-medium text-gray-700">Máquina:</label>
                  <select
                    id="machineSelect"
                    value={selectedMachine}
                    onChange={handleMachineChange}
                    className="w-[300px] h-[40px] border border-black rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#58B7A3] focus:border-transparent"
                  >
                    {machines.map(machine => (
                      <option key={machine.id} value={machine.id}>{machine.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="">
                <span className="font-bold text-lg">Gráfica de ventas</span>
                <div className='h-[400px] '>
                  {showChart && (typeof window !== 'undefined') && <ReactEcharts option={option_line} style={{ height: '100%', width: '100%' }} />}
                </div>
              </div>

              {/* TopSalesMachine component placed below the chart */}
              <TopSalesMachine salesData={salesData} selectedMachine={selectedMachine} period={period} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}