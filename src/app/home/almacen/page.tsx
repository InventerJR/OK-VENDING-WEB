import { Input } from '@/components/input'
import { APP_ROUTES } from '@/constants'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Administrar Alamacen',
  description: 'Welcome',
}

export default function AdminPage() {
  return (
    <main className="container py-12">
      <div className='container px-12 w-full h-fit py-6 pb-12 bg-white rounded-3xl flex flex-col'>

        <div className='border-b-[3px] border-b-[#2C3375] w-fit px-12 self-center'>
          <h1 className='uppercase font-bold text-3xl'>Almacen</h1>
        </div>

        <div className='flex flex-col gap-4'>
          <h2 className='font-bold text-xl'>Datos generales</h2>


          <p>Valor actual del inventario <span className='font-bold'>$20,000.00</span></p>

          <div className='flex flex-col md:flex-row gap-6 md:gap-4 py-8 items-center flex-1'>
            <Link href={APP_ROUTES.PURCHASES_ADMIN} className='w-1/2 md:w-[30%]'>
              <button type='button' className='bg-[#58B7A3] text-white font-semibold px-6 p-2 rounded-md w-full'>
                Compras
              </button>
            </Link>
            <Link href={APP_ROUTES.SALES_ADMIN} className='w-1/2 md:w-[30%]'>
              <button type='button' className='bg-[#58B7A3] text-white font-semibold px-6 p-2 rounded-md w-full'>
                Ventas
              </button>
            </Link>
            <Link href={APP_ROUTES.INVENTORY_ADMIN} className='w-1/2 md:w-[30%]'>
              <button type='button' className='bg-[#58B7A3] text-white font-semibold px-6 p-2 rounded-md w-full'>
                Inventario
              </button>
            </Link>
          </div>

        </div>

      </div>
    </main>
  )
}
