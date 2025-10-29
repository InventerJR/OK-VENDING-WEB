'use client';

import Image from 'next/image';
import { SalesAdminContextProvider, useSalesAdminContext } from './sales-admin.context'
import InventoryGrid from './sales-grid';
import { SetStateAction, useState } from 'react';
 

export default function UsersPage() {
  return (
    <SalesAdminContextProvider>
      <Page />
    </SalesAdminContextProvider>
  )
}


const Page = () => {
  const { products: users } = useSalesAdminContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra los productos según el término de búsqueda
  /*
  const filteredProducts = searchTerm.trim() === ''
    ? allProducts // Si no hay término de búsqueda, muestra todos los productos
    : allProducts.filter((product: { name: string; }) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) // Compara en minúsculas
    );
  */
  const handleSearchChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setSearchTerm(event.target.value);
  };

  return (
    <main className=" w-full py-12 px-4 md:px-12 h-full overflow-y-auto">
      <div className='md:container'>
        <div className='w-full h-fit gap-6 px-4 md:px-8 py-6 md:pb-12 bg-white rounded-3xl flex flex-col overflow-y-auto'>

          <div className='border-b-[3px] border-b-[#2C3375] w-fit px-12 self-center'>
            <h1 className='uppercase font-bold text-3xl'>Ventas</h1>
          </div>
          <section className='overflow-auto'>
            {/* table */}
            {/* table headers: Nombre | Teléfono | Email | Tipo | Actions*/}
            {/* pager */}
            <br/>
            <br/>
            <InventoryGrid />
          </section>
        </div>
      </div>
    </main>
  )
}



function CartButton() {
 const { openCart } = useSalesAdminContext();

  return (
    <button type='button' onClick={openCart} className='w-[32px] h-[32px]'>
      <Image src='/img/actions/cart.svg' alt='go to cart icon' width={32} height={32} className='w-[24px] h-[24px] self-start' />
    </button>
  )
}