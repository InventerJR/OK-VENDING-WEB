'use client';

import { Input } from '@/components/input'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'
import { InventoryAdminContextProvider, useInventoryAdminContext } from './inventory-admin.context'
import InventoryTable from './inventory-table';

export default function UsersPage() {
  return (
    <InventoryAdminContextProvider>
      <Page />
    </InventoryAdminContextProvider>
  )
}


const Page = () => {
  const { products: users } = useInventoryAdminContext();

  return (
    <main className="container py-12 h-full">
      <div className='container px-12 w-full h-full py-6 pb-12 bg-white rounded-3xl flex flex-col'>

        <div className='border-b-[3px] border-b-[#2C3375] w-fit px-12 self-center'>
          <h1 className='uppercase font-bold text-3xl'>Inventario</h1>
        </div>

        <div>
          <h2 className='font-bold text-xl'>Lista de productos</h2>
          <div>

            <div className='flex flex-row gap-3 items-center'>
              {/* filters */}
              <label className='flex flex-col w-[240px]'>
                <span className='font-semibold'>Búsqueda de producto</span>
                <input type='text' className='border border-gray-300 rounded-md h-[30px] p-1' />
              </label>
              <label className='flex flex-col w-[240px]'>
                <span className='font-semibold'>Clasificación</span>
                <select className='border border-gray-300 rounded-md h-[30px]'>
                  <option value=''>Seleccionar</option>
                  <option value='admin'>A</option>
                  <option value='supervisor'>B</option>
                  <option value='supervisor'>C</option>
                </select>
              </label>
              <div className='flex-1'></div>
              {/* add user */}
              {/* <button type='button' className='bg-[#58B7A3] rounded-full p-1 w-[42px] h-[42px] text-center relative'
                onClick={openCreateModal}>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit h-fit'>
                  <p className='text-[2.2rem] text-white font-medium leading-none text-center'>+</p>
                </div>
              </button> */}
            </div>

            <section className='mt-6  overflow-auto'>
              {/* table */}
              {/* table headers: Nombre | Teléfono | Email | Tipo | Actions*/}
              {/* pager */}

              <InventoryTable />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}