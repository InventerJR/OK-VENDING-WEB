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
    <main className=" w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
      <div className='container'>
        <div className='w-full h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>

          <div className='border-b-[3px] border-b-[#2C3375] w-fit px-12 self-center'>
            <h1 className='uppercase font-bold text-3xl'>Almacen</h1>
          </div>

          <div className='flex flex-col gap-4'>
            <h2 className='font-bold text-xl'>Datos generales</h2>


            <p>Valor actual del inventario <span className='font-bold'>$20,000.00</span></p>

            <div className='flex flex-col md:flex-row gap-6 md:gap-4 py-8 items-center flex-1'>
              <Link href={APP_ROUTES.PURCHASES_ADMIN} className='w-2/3 md:w-[30%]'>
                <button type='button' className='bg-[#58B7A3] text-white font-semibold px-6 p-2 rounded-md w-full'>
                  Compras
                </button>
              </Link>
              <Link href={APP_ROUTES.SALES_ADMIN} className='w-2/3 md:w-[30%]'>
                <button type='button' className='bg-[#58B7A3] text-white font-semibold px-6 p-2 rounded-md w-full'>
                  Ventas
                </button>
              </Link>
              <Link href={APP_ROUTES.INVENTORY_ADMIN} className='w-2/3 md:w-[30%]'>
                <button type='button' className='bg-[#58B7A3] text-white font-semibold px-6 p-2 rounded-md w-full'>
                  Inventario
                </button>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  )
}
