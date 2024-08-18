'use client';

import { useEffect, useState } from 'react';
import { getTotalInventoryValue } from '../../../../api'; // Ajusta la ruta según sea necesario
import { Input } from '@/components/input'
import { APP_ROUTES } from '@/constants'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'



export default function AdminPage() {
  const [inventoryValue, setInventoryValue] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventoryValue = async () => {
      try {
        const data = await getTotalInventoryValue();
        setInventoryValue(data.total_inventory_value);
      } catch (error) {
        setError('Error fetching inventory value');
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryValue();
  }, []);

  return (
    <main className="w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
      <div className='md:container'>
        <div className='w-full h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>

          <div className='border-b-[3px] border-b-[#2C3375] w-fit px-12 self-center'>
            <h1 className='uppercase font-bold text-3xl'>Almacen</h1>
          </div>

          <div className='flex flex-col gap-4'>
            <h2 className='font-bold text-xl'>Datos generales</h2>

            {loading ? (
              <p>Cargando valor del inventario...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <p>Valor actual del inventario <span className='font-bold'>${inventoryValue?.toFixed(2)}</span></p>
            )}

            <div className='flex flex-col md:flex-row gap-6 md:gap-4 py-8 items-center flex-1 justify-between'>
              <Link href={APP_ROUTES.ADMIN.PURCHASES_ADMIN} className='w-2/3 md:w-[30%]'>
                <button type='button' className='bg-[#58B7A3] text-white font-semibold px-6 p-2 rounded-md w-full'>
                  Almacenes físicos
                </button>
              </Link>
              <Link href={APP_ROUTES.ADMIN.WAREHOUSE_WAGON} className='w-2/3 md:w-[30%]'>
                <button type='button' className='bg-[#58B7A3] text-white font-semibold px-6 p-2 rounded-md w-full'>
                  Almacén móvil (Camionetas)
                </button>
              </Link>
              <Link href={APP_ROUTES.ADMIN.MACHINES_ADMIN} className='w-2/3 md:w-[30%]'>
                <button type='button' className='bg-[#58B7A3] text-white font-semibold px-6 p-2 rounded-md w-full'>
                  Máquinas
                </button>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  )
}
