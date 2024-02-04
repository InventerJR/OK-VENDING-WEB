'use client'

import classNames from 'classnames'
import '../globals.css'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { APP_ROUTES } from '@/constants'
import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { debounce, set } from 'lodash'
import { useAppContext } from '@/hooks/useAppContext'
import Link from 'next/link'
import SideBar from './sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()
  const { drawerOpen, setDrawerOpen, visible, setVisible } = useAppContext();

  const headerRef = useRef<HTMLDivElement>(null);

  const iconClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    router.push(APP_ROUTES.DASHBOARD)
  }

  const toggleDrawer = () => {
    // setDrawerOpen(x => !x)
    setVisible(x => !x)
  }
  return (
    <div className=''>
      <header ref={headerRef} className=' sticky top-0 h-[60px] bg-black z-[100] md:hidden flex flex-row gap-3 px-4'
        style={{
          boxShadow: '0 0 10px 0 rgba(128,128,128,255)'
        }}>

        <button className='text-white cursor-pointer z-50' onClick={toggleDrawer}>
          <Image src='/img/sidebar/menu.svg' alt='edit icon' width={24} height={24} className='w-[24px] h-[24px]' />
          {/* <Menu /> */}
        </button>

        <div id="logo-container" className='
        flex md:hidden
        w-[calc(80px-12px)] h-[60px] items-center justify-center'>
          <button className='bg-white rounded-full p-[6px] w-[42px] h-[42px] max-w-[42px] max-h-[42px]'
            onClick={iconClick}>
            <Image src='/img/machine.svg' alt='logo' width={42} height={42} className=' w-full h-full' />
          </button>
        </div>
      </header>
      <div className='flex flex-row relative'>
        <SideBar header={headerRef} />
        <div className={classNames({
          'flex-1 w-full overflow-auto bg-[#F0F0F0]': true
        })}>
            {children}
        </div>
      </div>
    </div>
  )
}