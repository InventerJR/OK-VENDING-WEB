'use client';

import { Input } from '@/components/input'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'
import { UsersAdminContextProvider, useUsersAdminContext } from './users-admin.context'
import UsersTable from './users-table';

export default function UsersPage() {
  return (
    <UsersAdminContextProvider>
      <Page />
    </UsersAdminContextProvider>
  )
}


const Page = () => {
  const { users, setIsOpenCreateModal } = useUsersAdminContext();

  const openCreateModal = () => {
    setIsOpenCreateModal(true);
  }

  return (
    <main className=" w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
      <div className='md:container'>
        <div className='w-full min-h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>

          <div className='border-b-[3px] border-b-[#2C3375] w-fit px-4 md:px-12 self-center'>
            <h1 className='uppercase font-bold text-3xl'>Usuarios</h1>
          </div>

          <div>
            <h2 className='font-bold text-xl'>Lista de usuarios</h2>
            <div>

              <div className='flex flex-col md:flex-row gap-3 md:items-center'>
                {/* filters */}

                <label className='flex flex-col w-[240px]'>
                  <span className='font-semibold'>Búsqueda de usuario</span>
                  <input type='text' className='border border-gray-300 rounded-md h-[30px] p-1' />
                </label>
                <label className='flex flex-col w-[240px]'>
                  <span className='font-semibold'>Tipo de usuario</span>
                  <select className='border border-gray-300 rounded-md h-[30px]'>
                    <option value=''>Seleccionar</option>
                    <option value='admin'>Administrador</option>
                    <option value='supervisor'>Supervisor</option>
                    <option value='operator'>Operador</option>
                  </select>
                </label>
                <div className='hidden md:block md:flex-1 2xl:flex-[0] xl:ml-6'></div>
                {/* add user */}
                <button type='button' className='self-start md:self-auto bg-[#58B7A3] rounded-full p-1 min-w-[42px] min-h-[42px] flex items-center justify-center'
                  onClick={openCreateModal}>
                  <Image src='/img/actions/plus.svg' alt='edit icon' width={20} height={20} className='w-[20px] h-[20px]' />
                </button>
              </div>

              <section className='mt-6 overflow-auto'>
                {/* table */}
                {/* table headers: Nombre | Teléfono | Email | Tipo | Actions*/}
                {/* pager */}

                <UsersTable />
              </section>
            </div>
          </div>
        </div>


      </div>
    </main>
  )
}