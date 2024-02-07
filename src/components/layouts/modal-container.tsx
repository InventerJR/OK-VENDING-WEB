import classNames from 'classnames';
import React, { ReactNode, useEffect, useState } from 'react'

interface ModalContainerProps {
    visible?: boolean;
    auto_width?: boolean;
    children?: ReactNode;
    onClose?: () => void; // Add a function prop for closing the modal
}

const ModalContainer = ({ visible, children, auto_width = true, onClose }: ModalContainerProps) => {

    // Call the onClose prop if the backdrop is clicked
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.target === event.currentTarget && onClose) {
            onClose();
        }
    }

    // Prevent the modal click from propagating to the backdrop
    const handleModalClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
    }

    // debounced visible value for smooth transition and hidding the content after the transition
    const [debouncedVisible, setDebouncedVisible] = useState(visible);
    useEffect(() => {
        if (visible) {
            setDebouncedVisible(true);
        } else {
            const timeout = setTimeout(() => {
                setDebouncedVisible(false);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [visible]);

    console.log('#visible', visible);
    console.log('debouncedVisible', debouncedVisible);

    return (
        <div className={
            classNames({
                "fixed top-[60px]  md:top-0 bottom-0 z-10 inset-0 flex flex-col items-center overflow-auto py-12  bg-[#000]": true,
                "bg-opacity-50 backdrop-filter backdrop-blur-[2px]": visible,
                // backdrop-grayscale
                " bg-opacity-0 pointer-events-none select-none": !visible
            })
        }
        style={{
            transition: visible ? "background 400ms ease-in-out 200ms, backdrop-filter 600ms ease-in 200ms, -webkit-backdrop-filter 600ms ease-in 200ms" : "background 300ms ease-in-out 100ms, backdrop-filter 300ms ease-out 200ms, -webkit-backdrop-filter 300ms ease-out 200ms",
            justifyItems: 'center safe',
            // alignItems: "center",
            // justifyContent: "center safe",
            // backgroundColor:"red"
        }}
            onClick={handleBackdropClick}>
            <div className={classNames({
                " bg-white rounded-3xl shadow-2xl flex flex-col h-fit m-auto": true,
                "opacity-52 translate-y-0": visible,
                "opacity-0 -translate-y-40": !visible,
                "w-96 md:w-3/4 lg:w-1/2 min-h-[120px]": auto_width,
            })}
                style={{
                    transition: visible ? "height 0s, width 0ms, transform 500ms 100ms, opacity ease-in-out 500ms " : "height 0s, width 0ms, transform ease-in-out 300ms, opacity 300ms",

                }}
                onClick={handleModalClick}>
                <div className='overflow-y-auto flex flex-col'>
                    {debouncedVisible && children}
                </div>
            </div>
        </div>
    )
}


export default ModalContainer