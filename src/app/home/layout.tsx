'use client'

import classNames from 'classnames'
import '../globals.css'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { APP_ROUTES } from '@/constants'
import { useRef, useState } from 'react'

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

const links = [
  {
    label: 'Dashboard',
    icon: '/img/sidebar/dashboard.svg',
    path: APP_ROUTES.DASHBOARD
  },
  {
    label: 'Usuarios',
    icon: '/img/sidebar/user.svg',
    path: APP_ROUTES.USER_ADMIN
  },
  {
    label: 'Almacen',
    icon: '/img/sidebar/storage.svg',
    path: APP_ROUTES.STORAGE_ADMIN
  },
  {
    label: 'Cargas',
    icon: '/img/sidebar/upload.svg',
    path: APP_ROUTES.PURCHASES_ADMIN
  },
  {
    label: 'Ventas',
    icon: '/img/sidebar/inputs-outputs.svg',
    path: APP_ROUTES.SALES_ADMIN
  },
  {
    label: 'Productos',
    icon: '/img/sidebar/products.svg',
    path: APP_ROUTES.INVENTORY_ADMIN
  },
  {
    label: 'Cerrar sesión',
    icon: '/img/sidebar/close.svg',
    path: APP_ROUTES.ACCESS.LOGIN
  },
]

const SideBar = () => {

  const router = useRouter()
  const pathname = usePathname()

  const handleRedirect = (path: string) => {
    router.push(path)
  }

  const [drawerOpen, setDrawerOpen] = useState(false);

  const navView = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);


  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('dragstart')
    setIsDragging(true);
    setDragStartX(e.clientX);
    setCurrentX(e.clientX);
    // e.preventDefault(); // Prevent text selection and other default behavior
    // document.body.style.cursor = "grabbing";
    document.body.style.cursor = "ew-resize";
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('handleDragEnd')
    setIsDragging(false);
    document.body.style.cursor = "default";
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    console.log('handleDrag', isDragging)
    if (isDragging) {
      const deltaX = e.clientX - currentX;
      setCurrentX(e.clientX);

      if (navView.current) {
        const minWidth = 80; // Minimum width when closed
        const maxWidth = 16 * 16; // Maximum width when open (16rem)
        const newWidth = navView.current.offsetWidth + deltaX;

        // Calculate the distance dragged from the initial drag point (dragStartX)
        const distanceDragged = e.clientX - dragStartX;

        const threshold = 10;

        console.log('xyz:distanceDragged', distanceDragged)
        console.log('xyz:deltaX', deltaX)
        console.log('xyz:newWidth', newWidth)

        // Check if dragging right (to open) or left (to close) based on the distance
        if (deltaX > threshold && distanceDragged > 20) {
          setDrawerOpen(true);
        } else if (deltaX > -threshold && distanceDragged < -20) {
          setDrawerOpen(false);
        }
      }
    }
  };

  return (
    <aside
      ref={navView}
      className={classNames({
        'z-50 sticky top-0 left-0 h-screen   bg-black text-white flex flex-row': true,
        // 'w-[calc(clamp(80px, 25vw, 18rem))]': true,
        "w-[190px]": drawerOpen,
        "w-[80px]": !drawerOpen,

        'cursor-w-resize': drawerOpen,
        'cursor-e-resize': !drawerOpen,
      })}
      onClick={() => setDrawerOpen(!drawerOpen)}
    >
      <div className='flex-1 flex flex-col '>

        <div id="logo-container" className='w-full flex items-center justify-center p-3'>
          <div className='bg-white rounded-full p-[6px]'>
            <Image src='/img/machine.svg' alt='logo' width={60} height={60} className='w-[60px] h-[60px]' />
          </div>
        </div>
        <nav id="links" className='flex-1'>
          <ul className={classNames({
            'space-y-2  select-none px-1 flex flex-col ': true,
            '': drawerOpen,
            'items-center': !drawerOpen,
          })}>
            {
              links.map((link, index) =>
                <LinkItem
                  key={index}
                  link={link}
                  index={index}
                  drawerOpen={drawerOpen}
                  setDrawerOpen={setDrawerOpen}
                  pathname={pathname}
                  handleRedirect={handleRedirect}
                />
              )
            }

          </ul>
        </nav>
        <div className={classNames({
          'p-2 py-6 text-center ': true,
          'max-w-[80px] ': !drawerOpen,
        })}>
          <p

            className={classNames({
              'max-w-[80px]  overflow-ellipsis line-clamp-1': !drawerOpen,
            })}>User User</p>
        </div>

      </div>

      <div
        className={classNames({
          "": true,
          "bg-gray-500": isDragging,
        })}
      >
        <div
          ref={divRef}
          className={classNames({
            "w-[4px] hover:bg-gray-500 sticky top-0 h-screen resize-handle": true,
            "dragging": isDragging,
          })}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrag={handleDrag}
          draggable
        ></div>
      </div>
      <div className="border-r"></div>

    </aside>
  )
}

const LinkItem = ({ link, index, drawerOpen, setDrawerOpen, pathname, handleRedirect }: {
  link: { label: string, icon: string, path: string },
  index: number,
  drawerOpen: boolean,
  setDrawerOpen: (open: boolean) => void,
  pathname: string,
  handleRedirect: (path: string) => void
}) => {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const handleMouseEnter = () => {
    setIsMouseOver(true);
  };

  const handleMouseLeave = () => {
    setIsMouseOver(false);
  };

  return (
    <li key={index} className='relative'>
      <button
        type='button'
        className={classNames({
          'hover:bg-[#52567C] rounded-full flex flex-row items-center gap-3': true,
          'py-2 px-3 w-full': drawerOpen,
          'py-2 px-2 w-fit ': !drawerOpen,
          'bg-[#2C3375]': pathname === link.path,
        })}
        onClick={(e) => {
          e.stopPropagation()
          handleRedirect(link.path)
          setDrawerOpen(false)
        }}
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
      >
        <Image src={link.icon} alt={link.path + ' icon'} width={32} height={32} className='w-[24px] h-[24px]' />

        <span className={classNames({
          // 'absolute left-[105%] w-fit z-10 text-left bg-black rounded-full px-3 p-2 text-nowrap': true,
          '': true,
          'block text-white': drawerOpen,
          'absolute left-[105%] w-fit z-10 text-left bg-black rounded-full px-3 p-2 text-nowrap': !drawerOpen,
        })}
          style={{ visibility: (isMouseOver && !drawerOpen || drawerOpen) ? 'visible' : 'hidden' }}>
          {link.label}
        </span>

      </button>
    </li>
  );
};