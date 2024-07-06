'use client'

import classNames from 'classnames'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { APP_ROUTES, SIDEBAR_LINKS } from '@/constants'
import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
import { useAppContext } from '@/hooks/useAppContext'

interface Props {
    header: React.RefObject<HTMLDivElement>,
}

const SideBar = (props: Props) => {
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
        document.body.style.cursor = "ew-resize";
    };

    const handleDragEnd = (e: React.DragEvent<any> | React.TouchEvent<any> | React.MouseEvent<any>) => {
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
                const distanceDragged = x - dragStartX;
                const threshold = 10;
                if (deltaX > threshold && distanceDragged > 20) {
                    setDrawerOpen(true);
                } else if (deltaX > -threshold && distanceDragged < -20) {
                    setDrawerOpen(false);
                }
            }
        }
    };

    const debouncedSetDrawerOpen = useCallback(debounce((open: boolean) => {
        setDrawerOpen(open);
    }, 60), []);

    useEffect(() => {
        const checkWindowSize = () => {
            if (window.innerWidth < 1024) {
                setDrawerOpen(false);
            }
            if (window.innerWidth >= 1150) {
                setDrawerOpen(true);
            }

            if (window.innerWidth > 600) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };
        checkWindowSize();
        window.addEventListener('resize', checkWindowSize);
        return () => {
            window.removeEventListener('resize', checkWindowSize);
        };
    }, []);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
            if (!navView.current?.contains(e.target as Node) && !header.current?.contains(e.target as Node)) {
                setTimeout(() => {
                    if (window.innerWidth < 1200) {
                        setDrawerOpen(false);
                    }
                    if (window.innerWidth < 1024) {
                        setVisible(false);
                    }
                }, 120);
            }
        };
        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/) || navigator.userAgent.match(/(Android)/)) {
            document.addEventListener('touchstart', handleOutsideClick);
        } else {
            document.addEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            if (navigator.userAgent.match(/(iPod|iPhone|iPad)/) || navigator.userAgent.match(/(Android)/)) {
                document.removeEventListener('touchstart', handleOutsideClick);
            } else {
                document.removeEventListener('mousedown', handleOutsideClick);
            }
        };
    }, []);

    const iconClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation()
        handleRedirect(APP_ROUTES.ADMIN.DASHBOARD)
    }

    const handleRedirect = (path: string) => {
        router.push(path)
    }

    const getUserFullName = () => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            return `${userData.first_name} ${userData.last_name}`;
        }
        return 'User User';
    };

    const getFirstLetters = (name: string) => {
        return name.split(' ').map((word) => word[0]).join('');
    };

    const userFullName = getUserFullName();

    return (
        <aside
            ref={navView}
            className={classNames({
                'bg-black text-white flex flex-row select-none z-10 h-full overflow-x-visible': true,
                'relative': true,
                'w-[190px]': drawerOpen,
                "w-[70px]": visible && !drawerOpen,
                'w-0 md:w-auto overflow-hidden': !visible,
                '!absolute !top-0 md:!relative': drawerOpen,
                'cursor-w-resize': drawerOpen,
                'cursor-e-resize': !drawerOpen,
            })}
            style={{ transition: 'width 240ms' }}
            onClick={(e) => {
                setDrawerOpen(x => !x)
                e.stopPropagation()
            }}
        >
            <div className='flex-1 flex flex-col h-full overflow-y-auto scroll overflow-x-hidden'
                style={{ scrollbarWidth: "thin", scrollbarColor: "#444 #808080" }}>

                <div id="logo-container" className='
                    hidden md:flex
                    w-full  items-center justify-center py-3'>
                    <button className='bg-white rounded-full p-[5px] w-[50px] h-[50px] max-w-[60px] max-h-[60px]'
                        onClick={iconClick}>
                        <Image src='/img/machine.svg' alt='logo' width={50} height={50} className=' w-full h-full' />
                    </button>
                </div>

                <nav id="links" className='flex-1 pt-6 md:pt-0 '
                    style={{ scrollbarWidth: "thin" }}>
                    <ul className={classNames({
                        'select-none px-2 flex flex-col gap-1': true,
                    })}>
                        {
                            SIDEBAR_LINKS.map((link, index, list) =>
                                <LinkItem
                                    key={index}
                                    link={link}
                                    index={index}
                                    drawerOpen={drawerOpen}
                                    setDrawerOpen={setDrawerOpen}
                                    pathname={pathname}
                                    handleRedirect={handleRedirect}
                                    visible={visible}
                                    total={list.length}
                                />
                            )
                        }
                    </ul>
                </nav>

                <div className={classNames({
                    'min-h-fit': true,
                    'p-2 py-6 text-center ': true,
                    'w-full ': !drawerOpen,
                })}>
                    <p className={classNames({
                        'max-w-[80px]  overflow-ellipsis line-clamp-1': !drawerOpen,
                    })}>
                        <span className=''>
                            {drawerOpen && userFullName}
                            {!drawerOpen && getFirstLetters(userFullName)}
                        </span>
                    </p>
                </div>

            </div>

            <div
                id="resize-handle"
                className={classNames({
                    "absolute top-0 bottom-0 ml-auto right-0 ": true,
                    "bg-gray-500": isDragging,
                })}
            >
                <div
                    ref={divRef}
                    className={classNames({
                        "w-[8px] md:w-[4px] hover:bg-gray-500 sticky top-0 h-full resize-handle": true,
                        "dragging": isDragging,
                    })}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDrag={handleDrag}
                    draggable
                ></div>
            </div>

            <style>{`
   .scroll::-webkit-scrollbar {
    height: 12px;
    width: 12px;
    background: #000;
}

.scroll::-webkit-scrollbar-thumb {
    background: #393812;
    -webkit-border-radius: 1ex;
    -webkit-box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.75);
}

.scroll::-webkit-scrollbar-corner {
    background: #000;
}
    `}</style>
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
    total: number;
}

const LinkItem = (props: LinkItemProps) => {
    const { link, index, drawerOpen, pathname, handleRedirect, visible, total } = props;
    const [isMouseOver, setIsMouseOver] = useState(false);
    const { setIsOpenModal, setTitleModal, setMessageModal, setHandledOk, isOpenModal } = useAppContext();

    const handleMouseEnter = () => {
        setIsMouseOver(true);
    };

    const handleMouseLeave = () => {
        setIsMouseOver(false);
    };

    function interceptLinkClicked(e: React.MouseEvent<HTMLButtonElement>, link: any, pathname: string, handleRedirect: (path: string) => void) {
    
        if (link.path === pathname) return;
    
        if (link.path === APP_ROUTES.ACCESS.LOGIN) {
            setIsOpenModal(true);
            setTitleModal("Cerrar Sesión");
            setMessageModal("¿Estas seguro que desas cerrar sesión?");
            setHandledOk(() => {
                handleRedirect(link.path)
                e.preventDefault();
            });
        } else {
            handleRedirect(link.path);
        }
    };
    

    return (
        <li key={index} className={classNames({
            "  z-[50] transition-all duration-200": true,
            "self-center w-fit": !drawerOpen,
            "self-start w-full": drawerOpen,
        })} style={{}}>
            <button
                type='button'
                className={classNames({
                    'relative hover:bg-[#414783] hover:border-[#414783] border border-transparent rounded-full flex flex-row items-center ease-in-out': true,
                    'p-2': true,
                    'w-full pl-3': drawerOpen,
                    'w-fit ': !drawerOpen,
                    'opacity-0 md:opacity-100': !visible,
                    'bg-[#2C3375]': pathname === link.path,
                })}
                style={{
                    transition: 'background 200ms 100ms, border 80ms, width 1000ms',
                }}
                onClick={interceptLinkClicked}
                onDoubleClick={(e) => {
                    handleMouseEnter()
                }}
            >
                <Image src={link.icon} alt={link.path + ' icon'} width={32} height={32} className='w-[24px] h-[24px] min-w-[24px] min-h-[24px] max-w-full' />
                <span className={classNames({
                    'text-nowrap line-clamp-1 transition-all duration-1000 z-[50]': true,
                    'block text-white duration-0 w-full opacity-100 ml-3  text-start': drawerOpen,
                    'absolute left-[40px] max-w-0 text-left bg-[#52567C] rounded-r-full': !drawerOpen,
                    'opacity-0 duration-0 pointer-events-none -translate-x-[40%] ': !isMouseOver && !drawerOpen,
                })}
                    style={{ transitionDuration: `${(index * 50) + 600}ms`, animationDelay: `300ms` }}
                >
                    {link.label}
                </span>
            </button>
        </li>
    );
};

export default SideBar;
