'use client'

import classNames from 'classnames'
import '../globals.css'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { APP_ROUTES } from '@/constants'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className='h-[100vh] w-full flex flex-col '>
      {/* <header></header> */}
      <div className='flex-1 flex flex-row bg-[#F0F0F0]'>
        <SideBar />
        <div className='flex-1 overflow-auto h-full flex'>
          {children}
        </div>
      </div>
    </div>
  )
}

const SideBar = () => {

  const router = useRouter()
  const pathname = usePathname()

  const handleRedirect = (path: string) => {
    router.push(path)
  }

  return (
    <aside className='h-full min-w-[160px] lg:min-w-[180px] xl:min-w-[220px] bg-black text-white flex flex-col gap-6'>
      <div className='w-full flex items-center justify-center p-3'>
        <div className='bg-white rounded-full p-[6px]'>
          <Image src='/img/machine.svg' alt='logo' width={60} height={60} className='w-[60px] h-[60px]' />
        </div>
      </div>
      <nav>
        <ul className='space-y-2  select-none px-1'>
          <li >
            <button type='button' className={classNames({
              'hover:bg-[#52567C] rounded-full py-2 px-3 flex flex-row items-center gap-3 w-full': true,
              'bg-[#2C3375]': pathname === APP_ROUTES.DASHBOARD
            })} onClick={() => handleRedirect(APP_ROUTES.DASHBOARD)}>
              <Image src='/img/sidebar/dashboard.svg' alt='dashboard icon' width={32} height={32} className='w-[24px] h-[24px]' />
              <span>Dashbaord</span>
            </button>
          </li>
          <li>
            <button type='button' className={classNames({
              'hover:bg-[#52567C] rounded-full py-2 px-3 flex flex-row items-center gap-3 w-full': true,
              'bg-[#2C3375]': pathname === APP_ROUTES.USER_ADMIN
            })} onClick={() => handleRedirect(APP_ROUTES.USER_ADMIN)}>
              <Image src='/img/sidebar/user.svg' alt='dashboard icon' width={32} height={32} className='w-[24px] h-[24px]' />
              <span>Usuarios</span>
            </button>
          </li>
          <li>
            <button type='button' className={classNames({
              'hover:bg-[#52567C] rounded-full py-2 px-3 flex flex-row items-center gap-3 w-full': true,
              'bg-[#2C3375]': pathname.includes(APP_ROUTES.STORAGE_ADMIN)
            })} onClick={() => handleRedirect(APP_ROUTES.STORAGE_ADMIN)}>
              <Image src='/img/sidebar/storage.svg' alt='dashboard icon' width={32} height={32} className='w-[24px] h-[24px]' />
              <span>Almacen</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}