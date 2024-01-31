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
// import Menu from "../../../public/img/sidebar/menu.svg"

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
    <div className='h-full w-full flex flex-col overflow-clip'>
      <nav ref={headerRef} className='h-[60px] bg-black z-10 md:hidden flex flex-row gap-3 px-4'>

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
      </nav>

      {/* <header></header> */}
      <div className='relative flex flex-row h-[calc(100dvh-60px)] md:h-full overflow-auto'>
        {/* {visible && <SideBar />} */}
        <SideBar header={headerRef} />
        <div className='flex-1 overflow-hidden flex min-w-[calc(100vw-60px)] md:min-w-[calc(100vw-180px)] bg-[#F0F0F0]'>
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

const SideBar = (
  { header }: { header: React.RefObject<HTMLDivElement> }
) => {

  const router = useRouter()
  const pathname = usePathname()

  const handleRedirect = (path: string) => {
    router.push(path)
  }

  const { drawerOpen, setDrawerOpen, visible, setVisible } = useAppContext();
  // const [drawerOpen, setDrawerOpen] = useState(true);

  const navView = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const divRef = useRef<any>(null);

  const handleDragStart = (e: React.DragEvent<any> | React.TouchEvent<any> | React.MouseEvent<any>) => {
    console.log('dragstart', e)
    setIsDragging(true);

    // setDragStartX(e.clientX);
    // setCurrentX(e.clientX);

    if ('touches' in e) {
      const x = e.touches[0].clientX
      setDragStartX(x);
      setCurrentX(x);
    } else if ('clientX' in e) {
      const x = e.clientX;
      setDragStartX(x);
      setCurrentX(x);

    }

    // e.stopPropagation()
    // e.preventDefault(); // Prevent text selection and other default behavior
    // document.body.style.cursor = "grabbing";
    document.body.style.cursor = "ew-resize";
  };

  const handleDragEnd = (e: React.DragEvent<any> | React.TouchEvent<any> | React.MouseEvent<any>) => {
    console.log('handleDragEnd', e)
    setIsDragging(false);
    document.body.style.cursor = "default";
  };

  const handleDrag = (
    e: React.DragEvent<any> | React.TouchEvent<any> | React.MouseEvent<any>
  ) => {
    console.log('handleDrag', isDragging, e)

    // e.stopPropagation()
    // e.preventDefault()

    document.body.classList.toggle("drag", isDragging);
    console.log("isDragging", isDragging);

    if (isDragging) {


      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;

      const deltaX = x - currentX;
      setCurrentX(x);

      if (navView.current) {
        const minWidth = 80; // Minimum width when closed
        const maxWidth = 16 * 16; // Maximum width when open (16rem)
        const newWidth = navView.current.offsetWidth + deltaX;

        // Calculate the distance dragged from the initial drag point (dragStartX)
        const distanceDragged = x - dragStartX;

        const threshold = 4;

        console.log('xyz:distanceDragged', distanceDragged)
        console.log('xyz:deltaX', deltaX)
        console.log('xyz:newWidth', newWidth)

        // Check if dragging right (to open) or left (to close) based on the distance
        if (deltaX > threshold && distanceDragged > 20) {
          // setDrawerOpen(true);
          debouncedSetDrawerOpen(true);
        } else if (deltaX > -threshold && distanceDragged < -20) {
          // setDrawerOpen(false);
          debouncedSetDrawerOpen(false);
        }
      }
    }
  };

  const debouncedSetDrawerOpen = useCallback(debounce((open: boolean) => {
    setDrawerOpen(open);
  }, 60), []);

  useEffect(() => {
    const checkWindowSize = () => {
      console.log('window.innerWidth', window.innerWidth)
      if (window.innerWidth < 1024) {
        setDrawerOpen(false);
      }
      if (window.innerWidth >= 1150) {
        setDrawerOpen(true);
      }

      if (window.innerWidth > 600) {
        console.log("set visible true")
        setVisible(true);
      } else {
        console.log("set visible false")
        setVisible(false);
      }

    };
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, []);

  // pressed outside the sidebar
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      console.log('handleOutsideClick', visible, !!navView.current, !navView.current?.contains(e.target as Node), visible && navView.current && !navView.current.contains(e.target as Node))
      if (!navView.current?.contains(e.target as Node) && !header.current?.contains(e.target as Node) && visible) {
        setTimeout(() => {

          if (window.innerWidth < 1200) {
            setDrawerOpen(false);
          }

          // if window is small, close the sidebar
          if (window.innerWidth < 1024) {
            console.log("set visible false")
            setVisible(false);
          }
        }, 120);
      }
    };
    // document.addEventListener('mousedown', handleOutsideClick);
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/) || navigator.userAgent.match(/(Android)/)) {
      console.log('touchstart')
      document.addEventListener('touchstart', handleOutsideClick);
    } else {
      console.log('mousedown')
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      // document.removeEventListener('mousedown', handleOutsideClick);
      if (navigator.userAgent.match(/(iPod|iPhone|iPad)/) || navigator.userAgent.match(/(Android)/)) {
        console.log('touchstart')
        document.removeEventListener('touchstart', handleOutsideClick);
      } else {
        console.log('mousedown')
        document.removeEventListener('mousedown', handleOutsideClick);
      }
    };
  }, []);

  const iconClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    handleRedirect(APP_ROUTES.DASHBOARD)
  }

  return (
    <aside
      // onTouchMove={(e)=>e.stopPropagation()}
      ref={navView}
      className={classNames({
        'z-50  h-[calc(100dvh-60px)] md:h-full   bg-black text-white flex flex-row select-none': true,
        ' transition-all duration-200': true,
        'hidden md:block': !visible,
        'relative md:block ': visible && !drawerOpen,
        'absolute md:block ': visible && drawerOpen,
        "absolute float-start   md:sticky top-0 left-0 ": true,
        "top-0 left-0 ": true,
        "w-[220px]": drawerOpen,
        "w-[55px]  md:w-[80px]": !drawerOpen,
        'cursor-w-resize': drawerOpen,
        'cursor-e-resize': !drawerOpen,
      })}
      onClick={(e) => {
        setDrawerOpen(x => !x)
        e.stopPropagation()
      }}
    >
      <div className='flex-1 flex flex-col h-full '>

        {/* logo on desktop */}
        <div id="logo-container" className='
        hidden md:flex 
        w-full  items-center justify-center py-3'>

          <button className='bg-white rounded-full p-[6px] w-[60px] h-[60px] max-w-[60px] max-h-[60px]'
            onClick={iconClick}>
            <Image src='/img/machine.svg' alt='logo' width={60} height={60} className=' w-full h-full' />
          </button>


        </div>

        {/* links */}
        <nav id="links" className='flex-1 mt-6 md:mt-0 overflow-y-auto overflow-x-hidden z-[1]'
          style={{ scrollbarWidth: "thin" }}>
          <ul className={classNames({
            'space-y-2  select-none px-1 flex flex-col cursor-default overflow-visible z-[1]': true,
            'left-0': drawerOpen,
            '  items-center': !drawerOpen,
          })}
            onClick={(e) => e.stopPropagation()}
          >
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


        {/* user data */}
        <div className={classNames({
          ' cursor-default': true,
          'p-2 py-6 text-center ': true,
          'w-full ': !drawerOpen,
        })}>
          <p

            className={classNames({
              'max-w-[80px]  overflow-ellipsis line-clamp-1': !drawerOpen,
            })}>
            <span className=''>
              {drawerOpen && "User User"}
              {!drawerOpen && getFirstLetters("User User")}
            </span>
          </p>
        </div>

      </div>


      {/* resize handle */}
      <div
        id="resize-handle"
        className={classNames({
          "absolute top-0 bottom-0 ml-auto right-0  z-50": true,
          "bg-gray-500": isDragging,
        })}
      >
        <div
          ref={divRef}
          className={classNames({
            "w-[8px] md:w-[4px] hover:bg-gray-500 sticky top-0 h-full resize-handle": true,
            "dragging": isDragging,
          })}
          // onTouchStart={handleDragStart}
          // onTouchMove={handleDrag}
          // onTouchEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrag={handleDrag}
          draggable
        ></div>
      </div>
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



  function clicked(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()

    if (link.path === pathname) return
    if (link.path === APP_ROUTES.ACCESS.LOGIN) {
      // logout
      handleRedirect(link.path)
    } else {
      handleRedirect(link.path)
      // setDrawerOpen(false)
    }
  }



  return (
    <li key={index} className=''>
      <button
        type='button'
        className={classNames({
          'hover:bg-[#52567C] rounded-full flex flex-row items-center gap-3': true,
          'py-2 px-3 w-full': drawerOpen,
          'py-2 px-2 w-fit ': !drawerOpen,
          'bg-[#2C3375]': pathname === link.path,
        })}
        onClick={clicked}
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
      >
        <Image src={link.icon} alt={link.path + ' icon'} width={32} height={32} className='w-[24px] h-[24px]' />

        <span className={classNames({
          '': true,
          'block text-white': drawerOpen,
          'absolute left-[94%] w-fit z-10 text-left bg-black rounded-full px-3 p-2 text-nowrap line-clamp-1 pl-4': !drawerOpen,
        })}
          style={{ visibility: (isMouseOver && !drawerOpen || drawerOpen) ? 'visible' : 'hidden' }}>
          {link.label}
        </span>

      </button>
    </li>
  );
};

function getFirstLetters(str: string) {
  return str.split(' ').map(word => word[0]).join('').toUpperCase()
}