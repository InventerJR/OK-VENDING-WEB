'use client'

import classNames from 'classnames'
import '../globals.css'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { APP_ROUTES, SIDEBAR_LINKS } from '@/constants'
import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { debounce, set } from 'lodash'
import { useAppContext } from '@/hooks/useAppContext'
import Link from 'next/link'

interface Props {
    header: React.RefObject<HTMLDivElement>,
}

export default function SideBar(props: Props) {
    const { header } = props;
    const router = useRouter()
    const pathname = usePathname()

    const { drawerOpen, setDrawerOpen, visible, setVisible } = useAppContext();

    const navView = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const divRef = useRef<any>(null);

    const handleDragStart = (e: React.DragEvent<any> | React.TouchEvent<any> | React.MouseEvent<any>) => {
        console.log('dragstart', e)
        setIsDragging(true);

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
        if (isDragging) {
            const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const deltaX = x - currentX;
            setCurrentX(x);
            if (navView.current) {
                const newWidth = navView.current.offsetWidth + deltaX;
                // Calculate the distance dragged from the initial drag point (dragStartX)
                const distanceDragged = x - dragStartX;
                const threshold = 10;
                // Check if dragging right (to open) or left (to close) based on the distance
                if (deltaX > threshold && distanceDragged > 20) {
                    setDrawerOpen(true);
                    // debouncedSetDrawerOpen(true);
                } else if (deltaX > -threshold && distanceDragged < -20) {
                    setDrawerOpen(false);
                    // debouncedSetDrawerOpen(false);
                }
            }
        }
    };

    const debouncedSetDrawerOpen = useCallback(debounce((open: boolean) => {
        setDrawerOpen(open);
    }, 60), []);

    useEffect(function winowMonitor() {
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
                console.log("set visible false on windowmonitor")
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
    useEffect(function clickMonitor() {
        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            console.log('handleOutsideClick', visible, !!navView.current, !navView.current?.contains(e.target as Node), visible && navView.current && !navView.current.contains(e.target as Node))
            if (!navView.current?.contains(e.target as Node) && !header.current?.contains(e.target as Node)) {
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

    const handleRedirect = (path: string) => {
        router.push(path)
    }

    return (
        <aside
            // onTouchMove={(e)=>e.stopPropagation()}
            ref={navView}
            className={classNames({
                'z-50  h-[calc(100dvh-60px)] md:h-full   bg-black text-white flex flex-row select-none': true,
                // 
                ' md:top-0 left-0': true,
                'top-[0px] sticky w-[80px] md:w-[80px] ': !drawerOpen && visible,
                'top-[60px] absolute md:sticky w-[220px]': drawerOpen && visible,
                'hidden md:block md:sticky w-[0px] md:w-[180px]': drawerOpen && !visible,
                'hidden md:block md:sticky w-[0px] md:w-[80px]': !drawerOpen && !visible,

                // 'relative md:block ': visible && !drawerOpen,
                // 'absolute md:block ': visible && drawerOpen,

                // "absolute float-start   md:sticky top-0  ": true,

                // "top-0 left-0 ": true,


                // "w-[220px]": drawerOpen,
                // "w-[60px]  md:w-[80px]": !drawerOpen,
                'cursor-w-resize': drawerOpen,
                'cursor-e-resize': !drawerOpen,
            })}
            style={{ transition: 'width 240ms' }}
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
                <nav id="links" className='flex-1 mt-6 md:mt-0 overflow-y-auto overflow-x-hidden z-[50]'
                    style={{ scrollbarWidth: "thin" }}>
                    <ul className={classNames({
                        'space-y-2  select-none px-2 flex flex-col cursor-default overflow-hidden z-[50]': true,
                        'left-0': drawerOpen,
                        '  items-center': !drawerOpen,
                    })}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {
                            SIDEBAR_LINKS.map((link, index) =>
                                <LinkItem
                                    key={index}
                                    link={link}
                                    index={index}
                                    drawerOpen={drawerOpen}
                                    setDrawerOpen={setDrawerOpen}
                                    pathname={pathname}
                                    handleRedirect={handleRedirect}
                                    visible={visible}
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
                    "absolute top-0 bottom-0 ml-auto right-0 z-[40]": true,
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

interface LinkItemProps {
    link: { label: string; icon: string; path: string };
    index: number;
    drawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
    pathname: string;
    handleRedirect: (path: string) => void;
    visible: boolean;
}

const LinkItem = (props: LinkItemProps) => {
    const { link, index, drawerOpen, pathname, handleRedirect, visible } = props;
    const [isMouseOver, setIsMouseOver] = useState(false);

    const handleMouseEnter = () => {
        setIsMouseOver(true);
    };

    const handleMouseLeave = () => {
        setIsMouseOver(false);
    };

    function interceptLinkClicked(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()

        if (link.path === pathname) return;

        if (link.path === APP_ROUTES.ACCESS.LOGIN) {
            // logout
            handleRedirect(link.path)
            e.preventDefault()
        } else {
            handleRedirect(link.path)
        }
    }

    return (
        <li key={index} className='' style={{ zIndex: 999 }}>
            {/* <Link href={link.path}> //using this re-mounts the sidebar */}
            <button
                type='button'
                className={classNames({
                    'hover:bg-[#52567C] rounded-full flex flex-row items-center gap-3 transition-opacity': true,
                    'py-2 px-3 w-full duration-0': drawerOpen,
                    'py-2 px-2 w-fit duration-300': !drawerOpen,
                    'opacity-0 md:opacity-100': !visible,
                    'bg-[#2C3375]': pathname === link.path,
                })}
                style={{ zIndex: 999 }}
                disabled={pathname === link.path}
                onClick={interceptLinkClicked}
                onMouseEnter={() => handleMouseEnter()}
                onMouseLeave={() => handleMouseLeave()}
            >
                <Image src={link.icon} alt={link.path + ' icon'} width={32} height={32} className='w-[24px] h-[24px] min-w-[24px] min-h-[24px] max-w-full' />
                <span className={classNames({
                    'text-nowrap line-clamp-1': true,
                    'block text-white': drawerOpen,
                    'absolute left-[94%] w-fit text-left bg-black rounded-full px-3 p-2 pl-4': !drawerOpen,
                })}
                    style={{ visibility: (isMouseOver && !drawerOpen || drawerOpen) ? 'visible' : 'hidden' }}>
                    {link.label}
                </span>
            </button>
            {/* </Link> */}

        </li>
    );
};

function getFirstLetters(str: string) {
    return str.split(' ').map(word => word[0]).join('').toUpperCase()
}

